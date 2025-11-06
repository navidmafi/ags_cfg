#!/usr/bin/env python3
import random
import time
import dbus
import dbus.service
from dbus.mainloop.glib import DBusGMainLoop
from gi.repository import GLib
import threading

class MinimalMPRIS(dbus.service.Object):
    def __init__(self):
        DBusGMainLoop(set_as_default=True)
        bus = dbus.SessionBus()
        bus_name = dbus.service.BusName('org.mpris.MediaPlayer2.spammer', bus)
        super().__init__(bus_name, '/org/mpris/MediaPlayer2')
        self.metadata = {}
    
    @dbus.service.method('org.freedesktop.DBus.Properties', in_signature='ss', out_signature='v')
    def Get(self, interface, prop):
        if interface == 'org.mpris.MediaPlayer2' and prop == 'Identity':
            return dbus.String("Spammer")
        elif interface == 'org.mpris.MediaPlayer2.Player' and prop == 'Metadata':
            return dbus.Dictionary(self.metadata, signature='sv')
        raise dbus.exceptions.DBusException(f'Property {prop} not found')
    
    @dbus.service.signal('org.freedesktop.DBus.Properties', signature='sa{sv}as')
    def PropertiesChanged(self, interface, changed_properties, invalidated_properties):
        pass
    
    def update_track(self, title, artist, album):
        self.metadata = {
            'mpris:trackid': dbus.ObjectPath(f'/track/{random.randint(1000, 9999)}'),
            'xesam:title': dbus.String(title),
            'xesam:artist': dbus.Array([dbus.String(artist)], signature='s'),
            'xesam:album': dbus.String(album),
        }
        
        changed_props = {
            'Metadata': dbus.Dictionary(self.metadata, signature='sv')
        }
        self.PropertiesChanged('org.mpris.MediaPlayer2.Player', changed_props, [])

def main():
    spammer = MinimalMPRIS()
    
    loop = GLib.MainLoop()
    threading.Thread(target=loop.run, daemon=True).start()
    
    artists = ["Artist A", "Artist B", "Artist C"]
    titles = ["Song 1", "Song 2", "Song 3"] 
    albums = ["Album X", "Album Y", "Album Z"]
    
    print("Minimal MPRIS spammer started. Press Ctrl+C to stop.")
    
    try:
        while True:
            title = random.choice(titles)
            artist = random.choice(artists)
            album = random.choice(albums)
            spammer.update_track(title, artist, album)
            print(f"{artist} - {title}")
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("\nStopped.")

if __name__ == "__main__":
    main()

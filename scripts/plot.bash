#!/bin/bash

proc_name="gjs"


generate_plot() {
	gnuplot <<EOF
set terminal pngcairo size 800,600
set output "mem.png"
set xdata time
set timefmt "%s"
set format x "%H:%M:%S"
set xlabel "Time"
set ylabel "Memory (kB)"
plot "mem_$1.txt" using 1:2 with lines title "VmRSS"
EOF
}

while true; do
	procpid=$(pidof "$proc_name")
	if [ $procpid ]; then
		timestamp=$(date +%s)
		memory=$(grep VmRSS /proc/$procpid/status | awk '{print $2}')
		echo "$timestamp $memory" >> "mem_${procpid}.txt"
		generate_plot $procpid
	else
		echo "no proc with that name"
	fi
	sleep 1
done


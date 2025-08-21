#!/bin/bash
end=$((SECONDS+5))
while [ $SECONDS -lt $end ]; do
    hyprctl dispatch workspace m+1
done
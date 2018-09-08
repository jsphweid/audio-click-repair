# audio-click-repair

A tool that automates click detection and removal, specifically the clicks that Mac computers are known to make: https://manual.audacityteam.org/man/faq_recording_troubleshooting.html#mac_crackle

### usage

The input file can be stereo / mono and probably any common sampling rate but it MUST be in wav format.

`main.py path/to/badFileInput.wav path/to/outputFile.wav`

### background

After I discovered a long audio file that was corrupted by countless clicks, I tried to remove them with some basic procedures in Audacity but couldn't do so. I posted on the Audacity forums (https://forum.audacityteam.org/viewtopic.php?f=28&t=100985) and they mentioned the "Repair" tool in Audacity. I found this to work well but you could only apply it to one click at a time.

So I set out to automate the process in python. First I wrote some basic detection logic that applies a very heavy high pass filter then searches for any anomalies in the very little signal that is left after the filter. Second I wrote a basic repair algorithm using autoregression from the statsmodels lib. This is what the "Repair" tool in Audacity does essentially. Finally I wrote a basic command line tool to interface with the code.

Thank you so much to my friend and PhD student Anup Mishra for helping me use statsmodels! Also thanks to Steve on the Audacity forums for helping me understand the issue better.

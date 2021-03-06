ADX Studio
==========

![ADX Studio](https://dl.dropboxusercontent.com/u/4885226/adx-studio_icon.png)

This is the Windows desktop IDE to create and/or edit ADCs (Askia Design Control) for [Askia](http://www.askia.com/) powered survey controls. 
It makes intensive use of [Electron](https://github.com/atom/electron) and [NodeJS](https://nodejs.org/en/).

Setup
-----

#### Installer

Download the [latest release](https://github.com/AskiaADX/ADXStudio/releases/latest) archive.

1.	After downloading the release, unzip `ADXStudio-win32-x64.zip` or `ADXStudio-win32-ia32.zip` depending on your OS environment.
2.	Open the `ADXStudio-win32-x64` (or `ADXStudio-win32-ia32`) folder.
3.	Double-click the `ADXStudio.exe` executable.
4.	Try to create your ADC with the ADCTemplate (project automatically open), or create a new Project.

*Note: do not tamper with any other components of `ADXStudio-win32-x64` / `ADXStudio-win32-ia32` folder.*

#### Manual

Clone the repository (via `HTTPS`, `SSH` or simply download the repository as a `.ZIP` archive).

Install [NodeJS](https://nodejs.org/download/).

Open [Powershell](https://msdn.microsoft.com/en-us/dd742419) as an `Administrator` and browse to the local ADXStudio repository. 
There, run the following commands:

```
npm install
```

```
electron app/main.js
```

Available resources
-------------------

-	[ADX specifications](https://github.com/AskiaADX/ADXStudio/wiki)
-	[Askiascript documentation](askiascript2_introduction_to_askiascript_2)
-	[List of ADCs 2.0](https://support.askia.com/hc/en-us/sections/200009182-askia-design-control-ADC-2-0-Javascript-)
-	[Askia website](http://askia.com/)

Authors
-------

-  [Maxime Gasnier](https://github.com/Maximeesilv)
-  [Vincent Tellier](https://github.com/VincentTel)
-  [Mamadou Sy](https://github.com/MamadouSy)
-  [Paul Nevin](https://github.com/uncleserb)
-  [Jérôme Sopoçko](https://github.com/BadJerry)
-  [Mehdi Aït-Bachir](https://github.com/AskiaMehdi)
-  [Jérôme Duparc](https://github.com/Djedj)

Contributors
------------

- [Robbe Van der Gucht](https://github.com/sir-ragna)

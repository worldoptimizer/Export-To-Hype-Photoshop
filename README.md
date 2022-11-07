# Export To Hype (Photoshop Edition)

![Testimonial](https://playground.maxziebell.de/Hype/ExportToHype/ExportToHypePhotoshop.jpg)

This Photoshop script exports all top-level layers and groups to cropped PNG and JPEG files and creates a file usable in Tumult Hype 4 based on your Photoshop document.

### Feedback in the Hype forum:

![Testimonial](https://playground.maxziebell.de/Hype/ExportToHype/testimonial.png)

### Installation Instructions:

Put the unzipped .jsx file into your Adobe Photoshop script folder. Replace [CURRENT YEAR] with the latest installed Photoshop version:

```
/Applications/Adobe Photoshop [CURRENT YEAR]/Presets/Scripts/
```

You can now access Export to Hype under `File → Export → Export to Hype`

### Additional tweaks

End your top-level layer name with the following commands to optimize output:

| Command   | Description                                                    |
|-----------|----------------------------------------------------------------|
| .jpg      | exports as JPEG with quality 75 (default)                      |
| .jpg\|50  | exports as JPEG with quality 50                                |
| .png\|16  | exports as PNG with 16 colors (requires ImageAlpha installed)  |
| .png\|256 | exports as PNG with 256 colors (requires ImageAlpha installed) |

Not adding anything defaults to `png`

---

Many thanks to my GitHub sponsors. For this project special thanks to Deutsche Presse Agentur (DPA, Infografik).

If you are also considering to support my work, it would be very much appreciated!
https://github.com/sponsors/worldoptimizer

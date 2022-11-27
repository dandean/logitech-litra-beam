# Logitech Litra Beam

This library provides an API for controlling the Logitech Litra Beam light with
TypeScript and JavaScript.

Supported functionality:

- on/off
- brightness (0 - 255)
- color temperature by degree (2700k warm to 6500k cool)
- color temperature by percentage (0 warm to 100% cool)

The library tries its best to automatically identify the connected Litra Beam,
but there is some nuance and limitation.

Devices are identified using the HID API (via the [hid](https://github.com/hyperdivision/hid) 
library). This can find the device whether it's connected via USB or Bluetooth.
If the device is connected via both USB _and_ Bluetooth, then the device is
listed twice – once for each connection type.

Unfortunately, at the time of writing, this library cannot use the Bluetooth
connection because its descriptor is missing the device serial number, so all
attempts to send messages to it fail. For this reason, **only direct USB-
connected devices are supported".

If you have multiple Litra Beams connected, the first one found will be used
UNLESS you provide a specific Litra Beam serial number to the constructor.
Device serial numbers are printed in obscenely small print on the back of the
device. Thankfully, you can print all connected Litra Beam device descriptor,
which contain serial numbers:

```sh
node -p "new (require('logitech-litra-beam').LitraBeam)().getDescriptors()"
```

## API

This library is written in TypeScript, so the API is discoverable in that
context. You can also [read the source code directly](https://github.com/dandean/litra-beam/blob/main/src/main.ts).

Here's a quick example to show how it works. This will:

- connect to the light
- turn it on
- set the color temperature to neutral
- set the brightness to 150
- wait 10 seconds, and then turn it off

```ts
import { LitraBeam } from 'logitech-litra-beam';

const light = new LitraBeam();

light.on();
light.setTemperaturePercentage(50);
light.setBrightness(150);

setTimeout(() => light.off, 10000);
```

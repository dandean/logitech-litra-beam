import { DeviceDescriptor, enumerate, OpaqueDevice, open, write } from 'hid';

export const ON = Buffer.from([0, 0x11, 0xff, 0x04, 0x1d, 0x01]);
export const OFF = Buffer.from([0, 0x11, 0xff, 0x04, 0x1d, 0x00]);

export const WARM = 2700;
export const COOL = 6500;
export const NEUTRAL = (COOL - WARM) / 2 + WARM;

export class LitraBeam {
  /**
   * Logitech's vendor ID
   */
  readonly #vendorId = 1133;

  /**
   * Litra Beam's product ID
   */
  readonly #productId = 51457;

  /**
   * A Litra Beam device descriptor
   */
  #descriptor?: DeviceDescriptor;

  /**
   * A handle to the specific device
   */
  #device: OpaqueDevice;

  constructor(private readonly serialNumber?: string) {
    // Get all HIDs and look for one with Litra's vendor ID and product ID.
    // Then filter that down to the one with a specific serial number, if given,
    // or the first Litra found.
    this.#descriptor = enumerate(this.#vendorId, this.#productId).find(
      (device) => {
        if (this.serialNumber) {
          return device.serial_number === this.serialNumber;
        }
        return true;
      }
    );

    if (!this.#descriptor) {
      throw new Error('Litra Beam not connected');
    }

    this.#device = open(
      this.#vendorId,
      this.#productId,
      this.#descriptor.serial_number
    );
  }

  public on(): void {
    write(this.#device, ON);
  }

  public off(): void {
    write(this.#device, OFF);
  }

  public setBrightness(value: number): void {
    const translatedValue = Math.round((value * (255 - 30)) / 255 + 30);

    write(
      this.#device,
      Buffer.from([0x11, 0xff, 0x04, 0x4f, 0x00, translatedValue])
    );
  }

  /**
   * Set the temperature to a value between the 2700 (warm) and 6500 (cool).
   * The device only accepts values rounded to the nearest hundred, so any
   * provided will be rounded.
   */
  public setTemperature(temperature: number): void {
    const temp = Math.min(
      Math.max(
        temperature || NEUTRAL, // Use neutral if NaN
        WARM // At least 2700
      ),
      COOL // at most 6500
    );

    // Convert the number to 16 bit, and pad it with 0 if necessary.
    // 2700 → a8c → 0A8C
    const hexTemperature = temp.toString(16).padStart(4, '0').toUpperCase();

    // Split the four-character number into two two-character numbers.
    // 0A8C → 0A,8C
    const first = parseInt(hexTemperature.slice(0, 2), 16);
    const second = parseInt(hexTemperature.slice(2), 16);

    write(this.#device, Buffer.from([0x11, 0xff, 0x04, 0x9d, first, second]));
  }

  /**
   * Set the temperature to a percentage between the 2700 (warm) and 6500 (cool)
   */
  public setTemperaturePercentage(percent: number): void {
    const constrainedPercentage = Math.min(
      Math.max(
        Number.isNaN(percent) ? 50 : percent, // Use neutral if NaN
        0
      ),
      100
    );

    const range = COOL - WARM;
    const step = range / 100;
    const temperature = constrainedPercentage * step + WARM;

    const temperatureToNearest100 = Math.round(temperature / 100) * 100;

    this.setTemperature(temperatureToNearest100);
  }
}

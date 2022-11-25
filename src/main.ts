import { LitraBeam } from './litra-beam';

const litra = new LitraBeam('2233FE601BQ8');
litra.on();
litra.setBrightness(150);

const steps = [
  () => litra.setTemperaturePercentage(0),
  () => litra.setTemperaturePercentage(10),
  () => litra.setTemperaturePercentage(20),
  () => litra.setTemperaturePercentage(30),
  () => litra.setTemperaturePercentage(40),
  () => litra.setTemperaturePercentage(50),
  () => litra.setTemperaturePercentage(60),
  () => litra.setTemperaturePercentage(70),
  () => litra.setTemperaturePercentage(80),
  () => litra.setTemperaturePercentage(90),
  () => litra.setTemperaturePercentage(100),
  () => litra.off(),
];

function next() {
  const step = steps.shift();
  if (step) {
    step();
  }

  if (steps.length) {
    setTimeout(next, 500);
  }
}

next();

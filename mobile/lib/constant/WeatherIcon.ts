const ClearDayLottie = require('../../assets/images/Weather/animated/clear-day.png');
const ClearNightLottie = require('../../assets/images/Weather/animated/clear-night.png');
const CloudyLottie = require('../../assets/images/Weather/animated/cloudy.png');
const DrizzleLottie = require('../../assets/images/Weather/animated/drizzle.png');
const FogDayLottie = require('../../assets/images/Weather/animated/fog-day.png');
const FogNightLottie = require('../../assets/images/Weather/animated/fog-night.png');
const OvercastDayLottie = require('../../assets/images/Weather/animated/overcast-day.png');
const OvercastNightLottie = require('../../assets/images/Weather/animated/overcast-night.png');
const PartlyCloudyDayLottie = require('../../assets/images/Weather/animated/partly-cloudy-day.png');
const PartlyCloudyNightLottie = require('../../assets/images/Weather/animated/partly-cloudy-night.png');
const RainLottie = require('../../assets/images/Weather/animated/rain.png');
const SnowLottie = require('../../assets/images/Weather/animated/snow.png');
const ThunderstormsDayLottie = require('../../assets/images/Weather/animated/thunderstorms-day.png');
const ThunderstormsNightLottie = require('../../assets/images/Weather/animated/thunderstorms-night.png');

export const WeatherAnimationMap: { [key: string]: any } = {
    "01d": ClearDayLottie,
    "01n": ClearNightLottie,
    "02d": PartlyCloudyDayLottie,
    "02n": PartlyCloudyNightLottie,
    "03d": CloudyLottie,
    "03n": CloudyLottie,
    "04d": OvercastDayLottie,
    "04n": OvercastNightLottie,
    "09d": DrizzleLottie,
    "09n": DrizzleLottie,
    "10d": RainLottie,
    "10n": RainLottie,
    "11d": ThunderstormsDayLottie,
    "11n": ThunderstormsNightLottie,
    "13d": SnowLottie,
    "13n": SnowLottie,
    "50d": FogDayLottie,
    "50n": FogNightLottie,
};

// Si vous avez encore besoin des SVGs statiques pour d'autres usages, vous pouvez les garder exportés,
// sinon, vous n'exporteriez que ce dont vous avez besoin.
export {
    ClearDayLottie,
    ClearNightLottie,
    CloudyLottie,
    DrizzleLottie,
    FogDayLottie,
    FogNightLottie,
    OvercastDayLottie,
    OvercastNightLottie,
    PartlyCloudyDayLottie,
    PartlyCloudyNightLottie,
    RainLottie,
    SnowLottie,
    ThunderstormsDayLottie,
    ThunderstormsNightLottie
};


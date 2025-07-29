// Exemple de votre WeatherIconMap avec les fichiers Lottie
// NOTE: Vous devrez ajuster les chemins et les noms de fichiers JSON !
const ClearDayLottie = require('../../assets/images/Weather/animated/clear_day.json');
const ClearNightLottie = require('../../assets/images/Weather/animated/clear_night.json');
const CloudyLottie = require('../../assets/images/Weather/animated/cloudy.json');
const DrizzleLottie = require('../../assets/images/Weather/animated/drizzle.json');
const FogDayLottie = require('../../assets/images/Weather/animated/fog_day.json');
const FogNightLottie = require('../../assets/images/Weather/animated/fog_night.json');
const OvercastDayLottie = require('../../assets/images/Weather/animated/overcast_day.json');
const OvercastNightLottie = require('../../assets/images/Weather/animated/overcast_night.json');
const PartlyCloudyDayLottie = require('../../assets/images/Weather/animated/partly_cloudy_day.json');
const PartlyCloudyNightLottie = require('../../assets/images/Weather/animated/partly_cloudy_night.json');
const RainLottie = require('../../assets/images/Weather/animated/rain.json');
const SnowLottie = require('../../assets/images/Weather/animated/snow.json');
const ThunderstormsDayLottie = require('../../assets/images/Weather/animated/thunderstorms_day.json');
const ThunderstormsNightLottie = require('../../assets/images/Weather/animated/thunderstorms_night.json');

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

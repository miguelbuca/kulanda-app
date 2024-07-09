export function greetings() {
  const now = new Date();
  const hour = now.getHours();

  const morningOptions = ["🌞 Bom dia!", "☀️ Olá, bom dia!", "🌅 Tenha um ótimo dia!"];
  const afternoonOptions = ["🌞 Boa tarde!", "☀️ Olá, boa tarde!"];
  const eveningOptions = ["🌙 Boa noite!", "🌜 Olá, boa noite!"];
  const nightOptions = ["🌌 Boa madrugada!", "🌠 Olá, boa madrugada!"];

  function getRandomOption(options: string[]) {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  if (hour >= 5 && hour < 12) {
    return getRandomOption(morningOptions);
  } else if (hour >= 12 && hour < 18) {
    return getRandomOption(afternoonOptions);
  } else if (hour >= 18 && hour < 22) {
    return getRandomOption(eveningOptions);
  } else {
    return getRandomOption(nightOptions);
  }
}

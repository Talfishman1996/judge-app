// Shared shame tier meme system
// Used across verdict pages for "% wrong" reaction images

export const SHAME_TIERS: Record<string, { images: string[]; label: string }> = {
  // 50% exactly - DRAW (tough decision vibe)
  tier_draw: {
    label: 'DRAW',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/023/397/C-658VsXoAo3ovC.jpg', // Two buttons sweating
      'https://i.kym-cdn.com/entries/icons/original/000/019/571/dailystruggg.jpg', // Daily struggle
    ],
  },
  // 51-55%: Barely wrong - skeptical side-eye (clean faces only)
  tier_51_55: {
    label: 'SUSPECT',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/014/285/sideeyechloe.jpg', // Side-eye Chloe
      'https://i.kym-cdn.com/entries/icons/original/000/006/026/NOTSUREIF.jpg', // Fry squint
      'https://i.kym-cdn.com/entries/icons/original/000/030/157/womanyellingcat.jpg', // Woman yelling at cat
    ],
  },
  // 56-60%: Something's off - confused/questioning (clean faces only)
  tier_56_60: {
    label: 'SUSPICIOUS',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/018/489/nick-young-confused-face-300x256-nqlyaa.jpg', // Nick Young ???
      'https://i.kym-cdn.com/entries/icons/original/000/021/464/14608107_1180665285312703_1558693314_n.jpg', // Confused math lady
      'https://i.kym-cdn.com/entries/icons/original/000/000/015/oreally.jpg', // O RLY owl skeptical
    ],
  },
  // 61-65%: Caught - surprised/busted (clean faces only)
  tier_61_65: {
    label: 'CAUGHT',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/006/506/pogchamp.jpg', // PogChamp surprised face
      'https://i.kym-cdn.com/entries/icons/original/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.png', // Surprised Pikachu
      'https://i.kym-cdn.com/entries/icons/original/000/026/913/excuse.jpg', // Blinking guy surprised
    ],
  },
  // 66-70%: Exposed - disapproval/judgment (clean faces only)
  tier_66_70: {
    label: 'EXPOSED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/021/557/conceit.jpg', // Conceited reaction face
      'https://i.kym-cdn.com/entries/icons/original/000/028/232/hamster.jpg', // Staring hamster
      'https://i.kym-cdn.com/entries/icons/original/000/028/861/cover3.jpg', // Monkey puppet side-eye
    ],
  },
  // 71-75%: Busted - facepalm/disappointment
  tier_71_75: {
    label: 'BUSTED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg', // Hide the Pain Harold
      'https://i.kym-cdn.com/entries/icons/original/000/000/554/picard-facepalm.jpg', // Picard facepalm
      'https://i.kym-cdn.com/entries/icons/original/000/034/890/cover3.jpg', // Oh no anyway
    ],
  },
  // 76-80%: Guilty - accepting fate/this is fine
  tier_76_80: {
    label: 'GUILTY',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/018/012/this_is_fine.jpeg', // This is fine dog
      'https://i.kym-cdn.com/entries/icons/original/000/025/621/Screen_Shot_2018-03-07_at_2.08.13_PM.png', // Guy on phone disgusted
      'https://i.kym-cdn.com/entries/icons/original/000/028/539/DyqSKoaX4AATc2G.jpg', // Hard to swallow pills
    ],
  },
  // 81-85%: Condemned - shame/crying
  tier_81_85: {
    label: 'CONDEMNED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/023/987/overcome.jpg', // Crying Jordan
      'https://i.kym-cdn.com/entries/icons/original/000/022/508/C7S0ouqVAAAwEIo.jpg', // Sad cat with tears
      'https://i.kym-cdn.com/entries/icons/original/000/025/543/thumbnail.jpg', // Sad Pablo Escobar
    ],
  },
  // 86-90%: Destroyed - devastation/PTSD
  tier_86_90: {
    label: 'DESTROYED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/033/701/PTSD_Chihuahua_Banner.jpg', // PTSD chihuahua
      'https://i.kym-cdn.com/photos/images/original/001/384/545/7b9.jpg', // Crying cat thumbs up
      'https://i.kym-cdn.com/entries/icons/original/000/029/927/cover4.jpg', // Thanos impossible
    ],
  },
  // 91-95%: Annihilated - chaos/disaster
  tier_91_95: {
    label: 'ANNIHILATED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/000/043/disaster-girl.jpg', // Disaster girl
      'https://i.kym-cdn.com/entries/icons/original/000/034/772/Untitled-1.png', // Crying cat
      'https://i.kym-cdn.com/entries/icons/original/000/032/991/hell.jpg', // Elmo fire
    ],
  },
  // 96-100%: Maximum clown - full circus (single faces only)
  tier_96_100: {
    label: 'CLOWN',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/032/858/cover1.jpg', // Joker "you get what you deserve"
      'https://i.kym-cdn.com/entries/icons/original/000/023/882/maxresdefault.jpg', // Pennywise dancing
      'https://i.kym-cdn.com/entries/icons/original/000/016/729/large.jpg', // Laughing Tom Cruise
    ],
  },
}

export function getShameData(wrongPercent: number): { image: string; label: string } {
  let tier: keyof typeof SHAME_TIERS

  if (wrongPercent === 50) tier = 'tier_draw'
  else if (wrongPercent <= 55) tier = 'tier_51_55'
  else if (wrongPercent <= 60) tier = 'tier_56_60'
  else if (wrongPercent <= 65) tier = 'tier_61_65'
  else if (wrongPercent <= 70) tier = 'tier_66_70'
  else if (wrongPercent <= 75) tier = 'tier_71_75'
  else if (wrongPercent <= 80) tier = 'tier_76_80'
  else if (wrongPercent <= 85) tier = 'tier_81_85'
  else if (wrongPercent <= 90) tier = 'tier_86_90'
  else if (wrongPercent <= 95) tier = 'tier_91_95'
  else tier = 'tier_96_100'

  const tierData = SHAME_TIERS[tier]
  const randomImage = tierData.images[Math.floor(Math.random() * tierData.images.length)]

  return { image: randomImage, label: tierData.label }
}

// Get emoji fallback based on wrongness level
export function getShameEmoji(wrongPercent: number): string {
  if (wrongPercent >= 90) return '💀'
  if (wrongPercent >= 75) return '😬'
  if (wrongPercent >= 60) return '😳'
  return '🤨'
}

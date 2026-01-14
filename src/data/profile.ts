export type Profile = {
  name: string
  handle: string
  title: string
  location: string
  shortBio: string
  links: {
    github: string
    email?: string
  }
}

export const profile: Profile = {
  name: 'Karsay Attila',
  handle: 'SSnowly',
  title: 'Junior Website Developer',
  location: 'Budapest, Hungary',
  shortBio: 'I am a junior website developer with a passion for creating fast and efficient websites. I am a quick learner and I am always looking to improve my skills.',
  links: {
    github: 'https://github.com/SSnowly',
    email: 'visionhyronic@gmail.com',
  },
}


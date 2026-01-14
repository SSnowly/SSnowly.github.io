export type Project = {
  id: string
  name: string
  descriptionSerious: string
  descriptionPlayful: string
  tech: string[]
  githubUrl?: string
  liveUrl?: string
  pinned?: boolean
  imageUrl?: string
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'Modrinth Manager',
    descriptionSerious: 'A command-line tool for managing Minecraft server mods from Modrinth. Simplifies installation, updates, and removal of mods.',
    descriptionPlayful: 'Because manually downloading 47 mods and praying they work together is so 2015. Now you can break your server with one command!',
    tech: ['Node.js', 'TypeScript', 'Command Line'],
    githubUrl: 'https://github.com/SSnowly/modrinth-manager',
    pinned: true,
  },
]


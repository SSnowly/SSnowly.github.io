import type { Project } from './projects'

export const githubProjectOverrides: Record<string, Partial<Project>> = {
  'choochootweaks': {
    name: "Choo Choo Tweaks",
    descriptionSerious: "A Minecraft mod that allows operators to modify the speed of minecarts independently.",
    descriptionPlayful: "Because why not? Faster trains go brrrrr.",
  },
  'networkjs': {
    name: "NetworkJS",
    descriptionSerious: "A Minecraft mod that adds a Discord bot + networking to the KubeJS Mod.",
    descriptionPlayful: "We love connecting to the external world from minecraft dont we? Let 'em be!",
  }
}


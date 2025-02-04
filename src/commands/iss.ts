import { ChatInputCommandInteraction } from 'discord.js';
import { TYPES } from '../types.js';
import { inject, injectable } from 'inversify';
import PlayerManager from '../managers/player.js';
import Command from './index.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { piss_percent } from '../services/ISS-data.js'


@injectable()
export default class implements Command {
    public readonly slashCommand = new SlashCommandBuilder()
        .setName('iss')
        .setDescription('Get some fun stats about the ISS (International Space Station)')
    public requiresVC = true;

    private readonly playerManager: PlayerManager;

    constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
        this.playerManager = playerManager;
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        try {
            await interaction.reply({
                content: 'Did you know that the ISS piss tank is ' + piss_percent + '% full?',
            });
        } catch (_: unknown) {
            throw new Error('no song to skip to');
        }
    }
}

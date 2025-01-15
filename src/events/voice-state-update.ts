import { VoiceChannel, VoiceState } from 'discord.js';
import container from '../inversify.config.js';
import { TYPES } from '../types.js';
import PlayerManager from '../managers/player.js';
import { getSizeWithoutBots } from '../utils/channels.js';
import { getGuildSettings } from '../utils/get-guild-settings.js';
import Player from "../services/player.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource } from '@discordjs/voice';

export default async (oldState: VoiceState, _: VoiceState): Promise<void> => {
  const playerManager = container.get<PlayerManager>(TYPES.Managers.Player);

  const player = playerManager.get(oldState.guild.id);

  if (player.voiceConnection) {
    const voiceChannel: VoiceChannel = oldState.guild.channels.cache.get(player.voiceConnection.joinConfig.channelId!) as VoiceChannel;
    const settings = await getGuildSettings(player.guildId);

    const { leaveIfNoListeners } = settings;
    if (!voiceChannel || (getSizeWithoutBots(voiceChannel) === 0 && leaveIfNoListeners)) {
      player.disconnect();
    }

    //Ofek's shit
    // TODO differentiate between joining and leaving
    // make sure its a feature that only works for the jelly server ("Guild")
    if (oldState.guild.name != "Jelly Lords") {
      return
    }
    if (getSizeWithoutBots(voiceChannel) > 1 && !player.getCurrent()) {
      var filepath = "";
      if (!oldState.channel) {
        filepath = './src/media/oshalom.mp3'
      } else {
        let memberPresent = oldState.channel?.members.find(member => {
          if (member == oldState.member) {
            return true;
          }
          return false;
        }, 0);
        if (!memberPresent) {
          filepath = './src/media/went.mp3'
        }
      }
      const resource = createAudioResource(filepath);
      const audioplayer = createAudioPlayer({
        behaviors: {
          maxMissedFrames: 50,
        },
      });
      audioplayer.play(resource);
      player.voiceConnection.subscribe(audioplayer);
    }
  }
};

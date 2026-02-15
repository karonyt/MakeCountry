import { EntityDamageCause, Player, world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
    world.getDimension('overworld').runCommand('gamerule showdeathmessages false')
});

world.afterEvents.entityDie.subscribe((ev) => {
    const { damageSource, deadEntity } = ev;
    const cause = damageSource.cause;
    const players = world.getPlayers().filter(p => p.getDynamicProperty('isMuteKillLog') != 'true')
    if (deadEntity instanceof Player) {
        const playerName = deadEntity.name;
        switch (cause) {
            case EntityDamageCause.anvil: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.anvil', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.projectile: {
                if (damageSource.damagingProjectile) {
                    let log = 'death.attack.arrow';
                    switch (damageSource.damagingProjectile.typeId) {
                        case 'minecraft:arrow': {
                            log = 'death.attack.arrow';
                            break;
                        }
                        case 'minecraft:thrown_trident': {
                            log = 'death.attack.trident';
                            break;
                        }
                    };
                    for (const p of players) {
                        p.sendMessage([{ translate: log, with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingProjectile.getComponent('projectile')?.owner ? damageSource.damagingProjectile.getComponent('projectile')?.owner != 'minecraft:player' ? damageSource.damagingProjectile.getComponent('projectile')?.owner.name : (damageSource.damagingProjectile.getComponent('projectile')?.owner.nameTag || damageSource.damagingProjectile.getComponent('projectile')?.owner.localizationKey) : damageSource.damagingProjectile.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.arrow', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.entityAttack: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.mob', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.maceSmash: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.maceSmash.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.magic: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.magic.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.magic', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.dehydration: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.dehydration', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.drowning: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.drown', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.fall: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.fall', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.fireworks: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.fireworks', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.fallingBlock: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.fallingBlock', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.flyIntoWall: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.flyIntoWall', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.selfDestruct: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.lava: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.lava', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.lightning: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.lightningBolt', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.magma: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.magma', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.fireTick: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.onFire.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.onFire', with: [playerName] }]);
                    };
                };
                break;
            };

            case EntityDamageCause.fire: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.inFire', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.wither: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.wither', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.freezing: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.freeze', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.starve: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.starve', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.sonicBoom: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.sonicBoom.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.sonicBoom', with: [playerName] }]);
                    };
                };
                break;
            };

            case EntityDamageCause.void: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.outOfWorld', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.stalagmite: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.stalagmite', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.stalactite: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.stalactite', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.suffocation: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.inWall', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.soulCampfire: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.onFire', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.campfire: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.onFire', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.contact: {
                //スイートベリーとかフグとか
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.sweetBerry', with: [playerName] }]);
                };
                break;
            }
            case EntityDamageCause.entityExplosion: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.explosion.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.explosion', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.thorns: {
                if (damageSource.damagingEntity) {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.thorns.player', with: { rawtext: [{ text: playerName }, { translate: damageSource.damagingEntity.typeId == 'minecraft:player' ? damageSource.damagingEntity.name : damageSource.damagingEntity.localizationKey }] } }]);
                    };
                } else {
                    for (const p of players) {
                        p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                    };
                };
                break;
            };
            case EntityDamageCause.blockExplosion: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.explosion.by.bed', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.override: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.piston: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.none: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.temperature: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.charging: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            case EntityDamageCause.ramAttack: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
                break;
            };
            default: {
                for (const p of players) {
                    p.sendMessage([{ translate: 'death.attack.generic', with: [playerName] }]);
                };
            }
        };
    };
});

/*
death.attack.arrow.item =% 1$sは % 2$sの % 3$sで射抜かれた
death.attack.bullet =% 1$sは % 2$sに狙撃された
death.attack.cactus =% 1$sはサボテンが刺さって死んだ
death.attack.cactus.player =% 1$sは % 2$sから逃げようとしてサボテンにぶつかった
death.attack.drown.player =% 1$sは % 2$sから逃れようとして溺れ死んだ
death.attack.explosion =% 1$sは爆発に巻き込まれた
death.attack.explosion.by.bed =% 1$s は[意図的なゲーム デザイン]に倒された
death.attack.explosion.player =% 1$sは % 2$sに爆破された

death.attack.fireball =% 1$sは % 2$sに火だるまにされた
death.attack.fireball.item =% 1$sは % 2$sの % 3$sで火だるまにされた
death.attack.indirectMagic =% 1$sは % 2$sの魔法で殺された
death.attack.indirectMagic.item =% 1$sは % 2$sの % 3$sで殺された
death.attack.inFire.player =% 1$sは % 2$sと戦いながら火の中へ踏み入った
death.attack.lava.player =% 1$sは % 2$sから逃れようと溶岩遊泳を試みた
death.attack.maceSmash.player =% 1$sは % 2$sに粉砕された
death.attack.maceSmash.player.item =% 1$s は % 2$s に % 3$s で粉砕された
death.attack.magic =% 1$sは魔法で殺された
death.attack.magma.player =% 1$s は % 2$s のせいで危険な領域を歩いた
death.attack.mob =% 1$sは % 2$sに殺害された
death.attack.mob.item =% 1$sは % 2$sの % 3$sで殺害された
death.attack.player =% 1$sは % 2$sに殺害された
death.attack.player.item =% 1$sは % 2$sの % 3$sで殺害された
death.attack.spit =% 1$sは % 2$sに丸めてポイされた
death.attack.thorns =% 1$sは % 2$sを傷つけようとして殺された
death.attack.thrown =% 1$sは % 2$sによってぺしゃんこにされた
death.attack.thrown.item =% 1$sは % 2$sの % 3$sでぺしゃんこにされた
death.attack.trident =% 1$sは % 2$sに刺殺された
death.attack.sonicBoom.player =% 1$sは % 2$sから逃れようとして衝撃波に消し飛ばされた
death.fell.accident.generic =% 1$sは高い所から落ちた
death.fell.accident.ladder =% 1$sははしごから落ちた
death.fell.accident.vines =% 1$sはツタから滑り落ちた
death.fell.accident.water =% 1$s は水から落ちた
death.fell.assist =% 1$sは % 2$sに落とされる運命だった
death.fell.assist.item =% 1$sは % 2$sの % 3$sで落とされる運命だった
death.fell.finish =% 1$sは高いところから落下し、% 2$sによってとどめを刺された
death.fell.finish.item =% 1$sは高いところから落下し、% 2$sの % 3$sによってとどめを刺された
death.fell.killer =% 1$sは落ちる運命だった
*/
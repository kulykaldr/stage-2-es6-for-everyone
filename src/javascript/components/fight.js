import { controls } from '../../constants/controls';

export function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    const firstFighterHealthIndicator = document.getElementById('left-fighter-indicator');
    const secondFighterHealthIndicator = document.getElementById('right-fighter-indicator');

    const fighterData = {
      currentHealth: 100,
      criticalAttack: false,
      criticalTime: 0,
      block: false,
      criticalEventKeys: [],
    };

    const firstPlayer = { ...firstFighter, ...fighterData, healthIndicator: firstFighterHealthIndicator };
    const secondPlayer = { ...secondFighter, ...fighterData, healthIndicator: secondFighterHealthIndicator };

    function attackAction(attacker, defender) {
      const totalDamage = getDamage(attacker, defender);

      attacker.block = false;
      defender.currentHealth = defender.currentHealth - (totalDamage / defender.health) * 100;

      if (defender.currentHealth < 0) {
        defender.currentHealth = 0;
      }

      defender.healthIndicator.style.width = `${defender.currentHealth}%`;

      if (defender.currentHealth <= 0) {
        resolve(attacker);
      }
    }

    function criticalHandler(fighter) {
      const currentTime = Date.now();

      if (currentTime - fighter.criticalTime < 10000) {
        return false;
      }

      if (!fighter.criticalEventKeys.includes(event.code)) {
        fighter.criticalEventKeys.push(event.code);
      }

      if (fighter.criticalEventKeys.length === 3) {
        fighter.criticalAttack = true;
        fighter.criticalTime = currentTime;
        return true;
      }
    }

    function handlerKeyDown(event) {
      if (!event.repeat) {
        switch (event.code) {
          case controls.PlayerOneAttack: {
            attackAction(firstPlayer, secondPlayer);
            break;
          }

          case controls.PlayerTwoAttack: {
            attackAction(secondPlayer, firstPlayer);
            break;
          }

          case controls.PlayerOneBlock: {
            firstPlayer.block = true;
            break;
          }

          case controls.PlayerTwoBlock: {
            secondPlayer.block = true;
            break;
          }
        }

        if (controls.PlayerOneCriticalHitCombination.includes(event.code) && criticalHandler(firstPlayer)) {
          attackAction(firstPlayer, secondPlayer);
        }

        if (controls.PlayerTwoCriticalHitCombination.includes(event.code) && criticalHandler(secondPlayer)) {
          attackAction(secondPlayer, firstPlayer);
        }
      }
    }

    function handlerKeyUp(event) {
      switch (event.code) {
        case controls.PlayerOneBlock:
          firstPlayer.block = false;
          break;
        case controls.PlayerTwoBlock:
          secondPlayer.block = false;
          break;
      }

      if (firstPlayer.criticalEventKeys.includes(event.code)) {
        firstPlayer.criticalEventKeys.splice(firstPlayer.criticalEventKeys.indexOf(event.code), 1);
      }

      if (secondPlayer.criticalEventKeys.includes(event.code)) {
        secondPlayer.criticalEventKeys.splice(secondPlayer.criticalEventKeys.indexOf(event.code), 1);
      }
    }

    window.addEventListener('keydown', handlerKeyDown);
    window.addEventListener('keyup', handlerKeyUp);
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const criticalChance = fighter.criticalAttack ? 2 : getRandomIntInclusive(1, 2);
  fighter.criticalAttack = false;
  return fighter.attack * criticalChance;
}

export function getBlockPower(fighter) {
  return fighter.block ? fighter.defense * getRandomIntInclusive(1, 2) : 0;
}

function getRandomIntInclusive(min, max) {
  return Math.random() * (max - min + 1) + min;
}

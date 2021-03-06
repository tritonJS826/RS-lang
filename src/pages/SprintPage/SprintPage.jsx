import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Timer from '../../components/Timer';
import StatusIcon from '../../components/StatusIcon';
import Button from '../../components/Button';
import SoundDisableIcon from '../../components/SoundsDisableIcon';
import GamesStatisticsDialog from '../../components/GamesStatisticsDialog';

import sprintMusic from '../../sounds/sprint-music.mp3';
import correctSound from '../../sounds/correct-answer.mp3';
import incorrectSound from '../../sounds/incorrect-sound.mp3';

import {
  DIFFICULTY_GAME_PENALTY,
  DIFFICULTY_GAME_REWARD,
} from '../../constants/variables-learning';
import WORD_HANDLER_KEYS from '../../constants/keys';
import wordHandler from '../../helpers/games-utils/wordHandler';

import styles from './SprintPage.module.scss';

const maxPointPerWord = 80;
const multiplyingFactor = 2;
const numberOfCorrectAnswersForCombos = 3;
const firstComboLevel = numberOfCorrectAnswersForCombos;
const secondComboLevel = numberOfCorrectAnswersForCombos * 2;
const thirdComboLevel = numberOfCorrectAnswersForCombos * 3;

const getNewPointsData = ({ pointPerWin, winStreak, points }) => {
  if (
    winStreak !== 0 &&
    winStreak % numberOfCorrectAnswersForCombos === 0 &&
    pointPerWin < maxPointPerWord
  ) {
    return {
      pointPerWin: pointPerWin * multiplyingFactor,
      winStreak: winStreak + 1,
      points: points + pointPerWin * multiplyingFactor,
    };
  }
  return { pointPerWin, winStreak: winStreak + 1, points: points + pointPerWin };
};

const music = new Audio(sprintMusic);
music.volume = 0.5;
const correctAnswerSound = new Audio(correctSound);
const incorrectAnswerSound = new Audio(incorrectSound);
const newWordsData = [];
const initialTimer = 60;
const coefficient = 1.66;
const initialPointsData = { pointPerWin: 10, winStreak: 0, points: 0 };

const sendingStatistics = (isPenalty, word, callback) => {
  let preparedWord;
  if (isPenalty) {
    preparedWord = wordHandler(word.wordDefault, [
      { key: WORD_HANDLER_KEYS.difficulty, value: DIFFICULTY_GAME_PENALTY },
    ]);
  } else {
    preparedWord = wordHandler(word.wordDefault, [
      { key: WORD_HANDLER_KEYS.difficulty, value: DIFFICULTY_GAME_REWARD },
      { key: WORD_HANDLER_KEYS.isHighPriority, value: true },
    ]);
  }
  callback(preparedWord);
};

const SprintPage = ({
  words,
  finallySendWordAndProgress,
  mode,
  increaseSprintAllAnswersStatistic,
  increaseSprintRightAnswersStatistic,
  trySetSprintMaxScoreStatistic,
  putProgress,
}) => {
  const [counter, setCounter] = useState(initialTimer);
  const [actualWord, setActualWord] = useState(0);
  const [pointsData, setPointsData] = useState(initialPointsData);
  const [isTrueAnswer, setIsTrueAnswer] = useState(false);
  const [isFalseAnswer, setIsFalseAnswer] = useState(false);
  const [isSoundsMute, setIsSoundsMute] = useState(false);
  const [isMusicMute, setIsMusicMute] = useState(false);
  const [isProtectorEnable, setIsProtectorEnable] = useState(false);
  const [wordsResult, setWordsResult] = useState([]);

  const playSound = (sound) => {
    if (isSoundsMute) return;
    sound.play();
  };

  const wordResultHandler = (isRight) => {
    const wordResult = { ...words[actualWord].wordDefault };
    wordResult.isRight = isRight;
    const newWordsResult = wordsResult;
    newWordsResult.push(wordResult);
    setWordsResult(newWordsResult);
  };

  const handlerUserAnswer = (isTrueButton) => {
    if (counter <= 0) {
      return null;
    }

    setIsProtectorEnable(true);
    setTimeout(() => {
      setIsProtectorEnable(false);
    }, 300);

    if (isTrueButton === words[actualWord].isCorrectTranslation) {
      increaseSprintAllAnswersStatistic();
      increaseSprintRightAnswersStatistic();
      wordResultHandler(true);
      playSound(correctAnswerSound);
      setIsTrueAnswer(true);
      setTimeout(() => setIsTrueAnswer(false), 500);
      setPointsData(getNewPointsData(pointsData));
      newWordsData.push({ id: words[actualWord].id, isCorrectAnswer: true });

      if (mode === 'learned words') {
        sendingStatistics(false, words[actualWord], finallySendWordAndProgress);
      }
    } else {
      increaseSprintAllAnswersStatistic();
      wordResultHandler(false);
      playSound(incorrectAnswerSound);
      setIsFalseAnswer(true);
      setTimeout(() => setIsFalseAnswer(false), 500);
      newWordsData.push({ id: words[actualWord].id, isCorrectAnswer: false });
      setPointsData({ ...initialPointsData, points: pointsData.points });

      if (mode === 'learned words') {
        sendingStatistics(true, words[actualWord], finallySendWordAndProgress);
      }
    }

    return setActualWord(actualWord + 1);
  };

  const handlerKeyPress = (e) => {
    if (isProtectorEnable) return undefined;
    if (e.key === 'ArrowRight') {
      return handlerUserAnswer(true);
    }

    if (e.key === 'ArrowLeft') {
      return handlerUserAnswer(false);
    }

    return undefined;
  };

  const handlerSoundMute = () => {
    setIsSoundsMute(!isSoundsMute);
  };

  const handlerMusicMute = () => {
    if (isMusicMute) {
      music.play();
    } else {
      music.pause();
    }

    setIsMusicMute(!isMusicMute);
  };

  useEffect(() => {
    music.play();
    return music.remove();
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', handlerKeyPress);

    return () => {
      window.removeEventListener('keyup', handlerKeyPress);
    };
  }, [isTrueAnswer, isFalseAnswer, isProtectorEnable]);

  useEffect(() => {
    if (counter > 0) {
      const id = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
    music.pause();
    music.currentTime = 0;
    window.removeEventListener('keyup', handlerKeyPress);
    return undefined;
  }, [counter]);

  const points = () => {
    if (pointsData.winStreak !== 0) {
      return <Box>{`+${pointsData.pointPerWin} очков`}</Box>;
    }
    return <Box>Поднажми!</Box>;
  };

  const sprintCard = () => (
    <>
      <Grid
        className={styles.Points}
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <SoundDisableIcon
          className={styles['Card__mute-button']}
          isMute={isMusicMute}
          handlerClick={handlerMusicMute}
          type="musicDisable"
          title="выключить музыку"
        />
        <Box className={styles.Points__counters}>
          <Typography variant="h4">
            <Box className={styles['Points__point-counter']} color="success.main">
              {pointsData.points}
            </Box>
          </Typography>
          <Timer color="secondary" value={counter} coefficient={coefficient} />
        </Box>
        <SoundDisableIcon
          className={styles['Card__mute-button']}
          isMute={isSoundsMute}
          handlerClick={handlerSoundMute}
          type="soundDisable"
          title="выключить звук"
        />
      </Grid>

      <Grid container direction="row" justify="center" alignItems="center">
        <Card
          className={classNames(
            styles.Card,
            isTrueAnswer && styles['true-color'],
            isFalseAnswer && styles['false-color']
          )}
        >
          <Grid item className={styles.Card__header}>
            <Box className={styles.Card__icons} color="success.main">
              <StatusIcon isActive={pointsData.winStreak >= firstComboLevel} />
              <StatusIcon isActive={pointsData.winStreak >= secondComboLevel} />
              <StatusIcon isActive={pointsData.winStreak >= thirdComboLevel} />
            </Box>
            <Typography className={styles.Card__points} gutterBottom variant="h6">
              {points()}
            </Typography>
          </Grid>
          <Grid className={styles.Card__main}>
            <Typography gutterBottom variant="h4">
              <Box>{words[actualWord].word}</Box>
            </Typography>
            <Typography gutterBottom variant="h5">
              <Box>{words[actualWord].wordTranslate}</Box>
            </Typography>
          </Grid>
          <Divider />
          <Grid className={styles.ButtonsGroup}>
            <div className={styles.ButtonsGroup__buttons}>
              <div className={styles.ButtonsGroup__button}>
                <Button
                  handlerClick={() => handlerUserAnswer(false)}
                  color="secondary"
                  text="Неверно"
                  isDisable={isProtectorEnable}
                />
              </div>
              <div>
                <Button
                  isDisable={isProtectorEnable}
                  handlerClick={() => handlerUserAnswer(true)}
                  color="primary"
                  text="Верно"
                />
              </div>
            </div>
          </Grid>
        </Card>
      </Grid>
    </>
  );

  if (counter <= 0) {
    trySetSprintMaxScoreStatistic(pointsData.points);
    putProgress();
  }

  return (
    <div className={styles.wrapper}>
      {(counter <= 0 && (
        <GamesStatisticsDialog isOpen words={wordsResult} score={pointsData.points} />
      )) ||
        sprintCard()}
    </div>
  );
};

SprintPage.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object).isRequired,
  finallySendWordAndProgress: PropTypes.func.isRequired,
  putProgress: PropTypes.func.isRequired,
  increaseSprintAllAnswersStatistic: PropTypes.func.isRequired,
  increaseSprintRightAnswersStatistic: PropTypes.func.isRequired,
  trySetSprintMaxScoreStatistic: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default SprintPage;

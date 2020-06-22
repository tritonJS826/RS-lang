import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Checkbox from '../../components/Checkbox';
import Inputs from '../../components/Input';

import style from './SettingsPage.module.scss';

const SettingsPage = ({ settings: storeSettings, putSettings }) => {
  const [settings, setSettings] = useState(storeSettings);

  const onSaveButton = (event) => {
    event.preventDefault();
    putSettings(settings);
  };

  return (
    <form className={style.Settings}>
      <Grid
        className={style.Settings__wrapper}
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        <p className={style.Settings__title}>Настройки приложения</p>

        <Inputs
          label="Учить слова за один день"
          value={settings.wordsPerDay}
          onChange={(e) => setSettings({ ...settings, wordsPerDay: e.target.value })}
        />
        <Inputs
          label="Новых слов в день"
          value={settings.newWordsPerDay}
          onChange={(e) => setSettings({ ...settings, newWordsPerDay: e.target.value })}
        />
        <Checkbox
          label="Кнопка 'Показать ответ'"
          checkValue={settings.answerBtn}
          toggle={() => setSettings({ ...settings, answerBtn: !settings.answerBtn })}
        />
        <Checkbox
          label="Кнопка 'Удалить из изучения'"
          checkValue={settings.delFromLearnBtn}
          toggle={() => setSettings({ ...settings, delFromLearnBtn: !settings.delFromLearnBtn })}
        />
        <Checkbox
          label="Кнопки 'Оценить сложность слова'"
          checkValue={settings.feedBackButtons}
          toggle={() => setSettings({ ...settings, feedBackButtons: !settings.feedBackButtons })}
        />
      </Grid>

      <Grid
        className={style.Settings__wrapper}
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        <p className={style.Settings__title}>Элементы карточки</p>
        <Checkbox
          label="Показывать картинку"
          checkValue={settings.image}
          toggle={() => setSettings({ ...settings, image: !settings.image })}
        />
        <Checkbox
          label="Показывать транскрипцию"
          checkValue={settings.transcription}
          toggle={() => setSettings({ ...settings, transcription: !settings.transcription })}
        />
        <Checkbox
          label="Показывать перевод"
          checkValue={settings.wordTranslate}
          toggle={() => setSettings({ ...settings, wordTranslate: !settings.wordTranslate })}
        />
        <Checkbox
          label="Перевод предложения"
          checkValue={settings.textExampleTranslate}
          toggle={() =>
            setSettings({ ...settings, textExampleTranslate: !settings.textExampleTranslate })
          }
        />
        <Checkbox
          label="Перевод значения"
          checkValue={settings.audioMeaning}
          toggle={() => setSettings({ ...settings, audioMeaning: !settings.audioMeaning })}
        />
        <Checkbox
          label="Кнопка 'прослушать слово'"
          checkValue={settings.audio}
          toggle={() => setSettings({ ...settings, audio: !settings.audio })}
        />
        <Checkbox
          label="Кнопка 'прослушать предложение'"
          checkValue={settings.audioExample}
          toggle={() => setSettings({ ...settings, audioExample: !settings.audioExample })}
        />
        <Checkbox
          label="Кнопка 'прослушать значение'"
          checkValue={settings.textMeaning}
          toggle={() => setSettings({ ...settings, textMeaning: !settings.textMeaning })}
        />
        <Checkbox
          label="Показвыть пример использования"
          checkValue={settings.textExample}
          toggle={() => setSettings({ ...settings, textExample: !settings.textExample })}
        />
      </Grid>
      <div className={style.Settings__btn}>
        <Button
          className={style.Settings__btn}
          variant="outlined"
          color="secondary"
          onClick={onSaveButton}
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
};

SettingsPage.propTypes = {
  settings: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string])).isRequired,
  putSettings: PropTypes.func.isRequired,
};

export default SettingsPage;

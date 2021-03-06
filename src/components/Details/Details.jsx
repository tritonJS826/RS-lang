import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles,
  Paper,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chart from '../../img/PromoPageScheduleWords.png';

import styles from './Details.module.scss';

const useStyles = makeStyles({
  root: {
    fontWeight: 'bold',
  },
  root1: {
    padding: '20px',
  },
});

const Details = ({ imgSrc, heading, paragraphs, lists }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Accordion
      expanded={expanded === `panel--${heading}`}
      onChange={handleChange(`panel--${heading}`)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography classes={{ root: classes.root }}>{heading}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper classes={{ root: classes.root1 }} elevation={0}>
          {imgSrc && <img className={styles.Details__chartWords} src={Chart} alt="chart" />}
          {paragraphs &&
            paragraphs.map((paragraph, j) => {
              const keyBody = `Details__${paragraph}-${j}`;

              return (
                <Typography className={styles.Details__paragraph} key={keyBody}>
                  {paragraph}
                </Typography>
              );
            })}
          {lists &&
            lists.map((list, index) => {
              const key = `Details__${list.tittle}-${index}`;

              return (
                <div key={key}>
                  <Typography variant="overline">
                    &nbsp;
                    {list.tittle}
                  </Typography>
                  <ul className={styles.Details__list}>
                    {list.points.map((point, i) => {
                      const keyLi = `Details__${point}-${i}`;

                      return <li key={keyLi}>{point}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

Details.propTypes = {
  imgSrc: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
  lists: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Details;

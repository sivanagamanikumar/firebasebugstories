import { useEffect, useState } from 'react';
import KidsData from './kidsData';
import { service } from './service';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import './App.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    margin: `${ theme.spacing(2) }px auto`,
  },
  typography: {
  },
}));

const App = () => {
  const classes = useStyles();
  const [ data, setData ] = useState([]);
  const [ showLoader, setShowLoader ] = useState(true);

  const fetchItem = async (story) => {
    const result = await service(
      `https://hacker-news.firebaseio.com/v0/item/${ story }.json`
    );
    const newState = {
      title: result.title,
      kids: result.kids,
      text: result.text,
      id: result.id,
      showBtn: true,
    };
    setData((prevData) => [ ...prevData, newState ]);
    setShowLoader(false);
  };

  const fetchData = async () => {
    let topStories = await service(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    const topTenStory = topStories.slice(0, 10);
    topTenStory.forEach((story) => {
      fetchItem(story);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="" fixed>
      <h1>Top 10 Stories</h1>
      {showLoader && <LinearProgress /> }
      <div>
        { data.map((item) => (
          <Grid item xs={ 12 } className={ classes.card }>
            <Paper className={ classes.paper }>
              <div>
                { item.title && (
                  <Typography className={ classes.typography }>
                    {item.title }
                  </Typography>
                ) }
                { item.text && (
                  <Typography className={ classes.typography }>{ item.title }</Typography>
                ) }
                { item.kids && <KidsData item={ item } key={ item.id } /> }
              </div>
            </Paper>
          </Grid>
        )) }
      </div>
    </Container>
  );
};

export default App;

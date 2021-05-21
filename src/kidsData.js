import { useState } from 'react';
import { Chip, LinearProgress } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import { makeStyles } from '@material-ui/core/styles';
import { service } from './service';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  card: {
    margin: `${ theme.spacing(2) }px auto`,
  },
  loader: {
    marginTop: `${ theme.spacing(2) }px`,
  },

}));

const KidsData = ({ item }) => {
  const classes = useStyles();
  const [ showBtn, setShowBtn ] = useState(true);
  const [ data, setData ] = useState([]);
  const [ showLoader, setShowLoader ] = useState(false);

  const fetchItem = async (id) => {
    const result = await service(
      `https://hacker-news.firebaseio.com/v0/item/${ id }.json`
    );
    if (result.type === 'comment') {
      const newState = {
        title: result.title,
        kids: result.kids,
        text: result.text,
        id: result.id,
        showBtn: true,
      };
      setData((prevData) => [ ...prevData, newState ]);
    }
    setShowBtn(false);
    setShowLoader(false);
  };

  const loadMoreData = (kidsArr) => {
    setShowLoader(true);
    kidsArr.forEach((id) => {
      fetchItem(id);
    });
  };

  return (
    <>
      {showBtn && (
        <Chip
          icon={ <CommentIcon /> }
          label={ `Open ${ item.kids.length } ${ item.kids.length > 1 ? 'Comments' : 'Comment'
            }` }
          data-testid={ item.id }
          clickable
          color="primary"
          onClick={ (event) => {
            event.stopPropagation();
            loadMoreData(item.kids, item.id);
          } }
          className={ classes.loader }
        />
      ) }
      {showLoader && (
        <LinearProgress className={ classes.loader } color="secondary" />
      ) }
      <ul>
        { data.map((item, index) =>
          item.text ? (
            <li key={ index }>
              {<div dangerouslySetInnerHTML={ { __html: item.text } } /> }
              {item.title && (
                <div dangerouslySetInnerHTML={ { __html: item.title } } />
              ) }
              {item.kids && <KidsData item={ item } key={ item.id } /> }
            </li>
          ) : null
        ) }
      </ul>
    </>
  );
};

export default KidsData;

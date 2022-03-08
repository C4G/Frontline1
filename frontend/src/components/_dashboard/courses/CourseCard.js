import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Grid, CardContent } from '@mui/material';

// ----------------------------------------------------------------------

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

// ----------------------------------------------------------------------

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
};

export default function CourseCard({ course }) {
  const { id, title, contentLink } = course;
  const match = contentLink.match(/youtube\.com.*(\?v=|\/watch\/)(.{11})/);
  let youtubeVideoID;
  if (match) {
    youtubeVideoID = match.pop();
  }
  const thumbnailLink = `//img.youtube.com/vi/${youtubeVideoID}/0.jpg`
  const thumbnail = (<img alt="course-thumbnail" src={thumbnailLink}/>);
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative' }}>
        {thumbnail}
        <CardContent sx={{ pt: 4 }} >
          <TitleStyle
            to={"/dashboard/courses/" + id}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
          >
            {title}
          </TitleStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}

import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Grid, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
//
import SvgIconStyle from '../../SvgIconStyle';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

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
  index: PropTypes.number
};

export default function CourseCard({ course, index }) {
  const { id, title, contentLink, isEnabled, createdDate } = course;
  if (!isEnabled) {
    return <></>;
  }
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle>
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
            }}
          />
        </CardMediaStyle>

        <CardContent sx={{ pt: 4 }} >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {fDate(createdDate)}
          </Typography>

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

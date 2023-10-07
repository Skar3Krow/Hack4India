import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { deepPurple, orange, common } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function SCard() {
    
    const theme = useTheme();
  return (
    <Card sx={{ minWidth: 250 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: orange[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        sx={[{ color: common.white },{bgcolor:deepPurple[700]}]}
        title="Student Name"
        subheader="CSE"
      />
      </Card>
  );
    }


export default SCard;
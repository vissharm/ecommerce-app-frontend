import { makeStyles } from '@material-ui/core/styles';

export const useSharedStyles = makeStyles((theme) => ({
  // Table Styles
  tableContainer: {
    borderRadius: theme.spacing(1),
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginTop: theme.spacing(3),
  },
  table: {
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 600,
    },
    '& .MuiTableRow-root': {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    '& .MuiTableCell-body': {
      padding: theme.spacing(2),
    },
  },
  
  // Modal Styles
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    '&:focus': {
      outline: 'none',
    },
  },
  modalTitle: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  
  // Form Styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  formField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1.1rem',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    },
  },
  
  // Card Styles
  card: {
    borderRadius: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  },
  
  // Status Chip Styles
  statusChip: {
    borderRadius: theme.spacing(0.75),
    fontWeight: 500,
    '&.success': {
      backgroundColor: theme.palette.success.light,
      color: theme.palette.success.dark,
    },
    '&.warning': {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.dark,
    },
    '&.error': {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.dark,
    },
  },
}));
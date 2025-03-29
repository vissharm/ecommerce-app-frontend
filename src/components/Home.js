import React from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardContent,
  List, ListItem, ListItemIcon, ListItemText, Paper 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { 
  Code as CodeIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  SwapHoriz as KafkaIcon // Added for Kafka
} from '@material-ui/icons';
import { getAuthData } from '../utils/secureStorage';

const useStyles = makeStyles((theme) => ({
  welcomeContainer: {
    position: 'relative',
    padding: theme.spacing(8, 0),
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(4),
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("/pattern.svg")',
      opacity: 0.1,
    }
  },
  welcomeText: {
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    fontWeight: 600,
    letterSpacing: '0.5px',
    animation: '$fadeIn 0.8s ease-out',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  statCard: {
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    }
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  statLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
  },
  statsContainer: {
    marginTop: theme.spacing(4),
  }
}));

// Define technologies array
const technologies = [
  {
    name: 'React & Material-UI',
    description: 'Modern frontend framework with beautiful components',
    icon: <CodeIcon color="primary" />
  },
  {
    name: 'Node.js Microservices',
    description: 'Scalable backend architecture',
    icon: <StorageIcon color="primary" />
  },
  {
    name: 'Apache Kafka',
    description: 'Event-driven message broker for service communication',
    icon: <KafkaIcon color="primary" />
  },
  {
    name: 'WebSocket Real-time',
    description: 'Instant updates and notifications',
    icon: <SpeedIcon color="primary" />
  },
  {
    name: 'JWT Authentication',
    description: 'Secure user authentication and authorization',
    icon: <SecurityIcon color="primary" />
  }
];

function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = getAuthData();

  return (
    <Container maxWidth="lg">
      <Box className={classes.welcomeContainer}>
        <Typography variant="h2" className={classes.welcomeText}>
          {user?.name ? (
            <>
              Welcome back, <span style={{ color: '#64ffda' }}>{user.name}</span>!
            </>
          ) : (
            'Welcome to E-commerce App'
          )}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Key Technologies Section */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Key Technologies
              </Typography>
              <List>
                {technologies.map((tech, index) => (
                  <ListItem key={index} className={classes.listItem}>
                    <ListItemIcon>
                      {tech.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={tech.name}
                      secondary={tech.description}
                      primaryTypographyProps={{ style: { fontWeight: 500 } }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Technology Usage Stats */}
              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Technology Usage Statistics
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'API Endpoints', value: '50+' },
                    { label: 'Kafka Topics', value: '10+' },
                    { label: 'WebSocket Events', value: '15+' },
                    { label: 'Daily Transactions', value: '1000+' }
                  ].map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper 
                        elevation={1} 
                        style={{ 
                          padding: '16px',
                          textAlign: 'center',
                          background: 'rgba(0, 0, 0, 0.02)',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          style={{ 
                            color: '#1976d2',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          style={{ 
                            color: 'rgba(0, 0, 0, 0.6)'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* System Health Indicators */}
              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  System Health
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Service Uptime', value: '99.9%', color: '#4caf50' },
                    { label: 'Response Time', value: '<100ms', color: '#2196f3' },
                    { label: 'Memory Usage', value: '60%', color: '#ff9800' },
                    { label: 'CPU Load', value: '45%', color: '#2196f3' }
                  ].map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper 
                        elevation={1} 
                        style={{ 
                          padding: '16px',
                          textAlign: 'center',
                          background: 'rgba(0, 0, 0, 0.02)',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          style={{ 
                            color: stat.color,
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          style={{ 
                            color: 'rgba(0, 0, 0, 0.6)'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Features Section */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary" style={{ 
                fontWeight: 600,
                borderBottom: '2px solid #1976d2',
                paddingBottom: '8px',
                marginBottom: '24px'
              }}>
                System Features
              </Typography>
              
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>⚛</span> Frontend Technologies
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>React with Material-UI:</strong> Modern, responsive interface<br />
                  • <strong>Real-time WebSocket:</strong> Instant updates and notifications<br />
                  • <strong>JWT Authentication:</strong> Secure user sessions<br />
                  • <strong>State Management:</strong> Efficient client-side data handling<br />
                  • <strong>Responsive Design:</strong> Mobile and desktop optimized
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🔄</span> Microservices Architecture
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>Order Service (3002):</strong> Order lifecycle management<br />
                  • <strong>Product Service (3004):</strong> Inventory and pricing control<br />
                  • <strong>User Service (3001):</strong> Authentication and profiles<br />
                  • <strong>Notification Service (3003):</strong> Real-time alerts<br />
                  • <strong>API Gateway (8080):</strong> Unified entry point
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📡</span> Event-Driven Communication
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>Apache Kafka (9092):</strong> Message broker system<br />
                  • <strong>ZooKeeper (2181):</strong> Distributed coordination<br />
                  • <strong>Event Processing:</strong> Asynchronous workflows<br />
                  • <strong>Real-time Updates:</strong> Instant data synchronization<br />
                  • <strong>Service Communication:</strong> Decoupled architecture
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>⚡</span> Real-time Features
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>Live Notifications:</strong> Instant order updates<br />
                  • <strong>Stock Tracking:</strong> Real-time inventory management<br />
                  • <strong>User Activity:</strong> Live monitoring and analytics<br />
                  • <strong>WebSocket Events:</strong> Bidirectional communication<br />
                  • <strong>Dynamic Updates:</strong> Instant UI refreshes
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🔒</span> Security & Data
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>JWT Authentication:</strong> Secure token-based auth<br />
                  • <strong>MongoDB Database:</strong> Scalable data storage<br />
                  • <strong>API Security:</strong> Protected endpoints<br />
                  • <strong>Role-based Access:</strong> Granular permissions<br />
                  • <strong>Session Management:</strong> Secure user sessions
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🚀</span> Development & Deployment
                </Typography>
                <Typography variant="body1" style={{ paddingLeft: '28px' }}>
                  • <strong>Docker Containers:</strong> Isolated environments<br />
                  • <strong>Multi-service Setup:</strong> Integrated development<br />
                  • <strong>Environment Config:</strong> Flexible deployment<br />
                  • <strong>Logging System:</strong> Centralized monitoring<br />
                  • <strong>CI/CD Pipeline:</strong> Automated deployment
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Grid container spacing={3} className={classes.statsContainer}>
        {[
          { label: 'Total Products', value: '150+' },
          { label: 'Active Users', value: '1.2K' },
          { label: 'Orders Processed', value: '5K+' },
          { label: 'Uptime', value: '99.9%' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className={classes.statCard} elevation={2}>
              <Typography className={classes.statValue}>
                {stat.value}
              </Typography>
              <Typography className={classes.statLabel}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;

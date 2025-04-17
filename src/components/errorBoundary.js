import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { error: null };
  
  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Container sx={{ p: 4 }}>
          <Typography color="error" variant="h5">
            Something went wrong:
          </Typography>
          <Typography>{this.state.error.message}</Typography>
        </Container>
      );
    }
    return this.props.children;
  }
}
import MarvelAPIRoutes from './MarvelAPI.js';

const constructorMethod = (app) => {
  app.use('/api', MarvelAPIRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Route not valid'});
  });
};

export default constructorMethod;

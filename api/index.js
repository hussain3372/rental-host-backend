const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, Logger } = require('@nestjs/common');
const { AppModule } = require('../dist/app.module');
const helmet = require('helmet');
const compression = require('compression');
const { ConfigService } = require('@nestjs/config');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Get configuration service
    const configService = app.get(ConfigService);
    const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

    // Global pipes
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }));

    // Middleware
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }));

    app.use(compression());

    // CORS
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    // Swagger Documentation
    const config = new DocumentBuilder()
      .setTitle('Rental Host Certification Platform API')
      .setDescription('Complete API documentation for the Rental Host Certification Platform')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('admin', 'Admin portal endpoints')
      .addTag('application', 'Certification application management')
      .addTag('certification', 'Certification lifecycle management')
      .addTag('document', 'Document upload and management')
      .addTag('payment', 'Payment processing and billing')
      .addTag('registry', 'Public certification registry')
      .addTag('support', 'Support tickets and FAQ management')
      .addTag('health', 'System health monitoring')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await createApp();
    const handler = nestApp.getHttpAdapter().getInstance();
    return handler(req, res);
  } catch (error) {
    Logger.error('❌ Error in serverless handler', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

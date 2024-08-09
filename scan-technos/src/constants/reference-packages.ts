export const frontendPackages = {
  React: 'react',
  Angular: '@angular/core',
  Vue: 'vue',
  Svelte: 'svelte',
  Ember: 'ember',
  Preact: 'preact',
  Next: 'next',
  Nuxt: 'nuxt',
  Glimmer: 'glimmer',
  Backbone: 'backbone'
} as const; 
  
export const backendPackages =  {
  Nestjs : '@nestjs/core',
  Express: 'express',
  Loopback: 'loopback',
  Strapi: 'strapi/strapi'
} as const;

export const testPackages = {
  Jest: 'jest',
  Karma: 'karma',
  Protractor: 'protractor',
  Cypress: 'cypress',
  Cucumber: 'cucumber'
} as const;

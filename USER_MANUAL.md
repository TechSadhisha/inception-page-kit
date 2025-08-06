# Real Estate CRM - Complete User Manual

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Detailed Feature Guide](#detailed-feature-guide)
5. [Integration Capabilities](#integration-capabilities)
6. [Administration](#administration)
7. [Support & Legal](#support--legal)

## Overview

This Real Estate CRM is a comprehensive lead generation and management platform designed specifically for real estate professionals. It combines project management, lead generation, campaign management, and team collaboration tools in a unified interface.

## Getting Started

### Authentication
- **Login/Registration**: Access via `/auth` route
- **User Profile**: Automatically created on first login
- **Session Management**: Secure authentication with persistent sessions

### Dashboard (Home)
**Route**: `/`

The dashboard provides an overview of your CRM with:
- **Quick Statistics**: Active projects, total prospects, reports generated, messages
- **Recent Projects**: Latest real estate projects
- **Recent Activity**: Updates and notifications
- **Quick Actions**: Direct access to create projects, add prospects, generate reports

## Core Features

### 1. Project Management
**Route**: `/projects`

**Features**:
- Create and manage real estate projects
- Project statuses: Planning, Active, Completed, On Hold
- Project search and filtering
- Individual project sheets and lead centres
- Project assignments and team collaboration

**Sub-routes**:
- `/projects/:projectId/sheets` - Google Sheets integration for project data
- `/projects/:projectId/lead-centre` - Centralized lead management per project

### 2. Prospect Management
**Route**: `/prospects`

**Features**:
- Add and manage potential clients
- Prospect scoring and qualification
- Contact information management
- Interest tracking and categorization
- Google Maps contact scraping integration
- Bulk prospect import functionality
- Apify integration for automated prospect collection

### 3. Lead Centre
**Route**: `/projects/:projectId/lead-centre`

**Features**:
- Centralized lead management for specific projects
- Lead source integration and tracking
- Lead assignment workflows
- Performance analytics
- Bulk lead upload capabilities
- Facebook Lead Forms integration

### 4. Campaign Management
**Route**: `/campaigns`

**Features**:
- Create and manage Meta/Facebook advertising campaigns
- Campaign targeting (location, demographics, interests)
- Budget management and tracking
- Campaign performance analytics
- Creative asset management (images, headlines, descriptions)
- Facebook integration for direct campaign publishing
- Campaign status management (Active, Paused, Draft)

### 5. Task Management
**Route**: `/tasks`

**Features**:
- Create and assign tasks
- Task calendar with date-based organization
- Task status tracking
- Team collaboration on tasks
- Due date management

### 6. Communication Tools

#### Team Messages
**Route**: `/messages`
- Internal team communication
- Message threads and history
- Real-time messaging capabilities

#### WhatsApp Integration
**Route**: `/whatsapp`
- Send WhatsApp messages to prospects/clients
- Message history and tracking
- Bulk WhatsApp messaging
- Integration with prospect database

#### Email Management
**Route**: `/emails`
- Gmail integration
- Email viewing and management
- Email account settings
- Automated email workflows

### 7. Reporting & Analytics
**Route**: `/reports`

**Features**:
- Overview reports with key metrics
- Project-specific reports
- Prospect analytics and insights
- Team performance reports
- Enhanced reporting with detailed breakdowns
- Activity charts and visualizations

### 8. Property Management
**Route**: `/properties`

**Features**:
- Property listing management
- Property information storage
- Property search and filtering
- Integration with real estate portals
- Property synchronization tools

### 9. Knowledge Base
**Route**: `/knowledge`

**Features**:
- Store and organize company knowledge
- Video content management
- YouTube search integration
- Training materials and documentation

### 10. Script Management
**Route**: `/scripts`

**Features**:
- Create and manage sales scripts
- OpenAI-powered script generation
- Text-to-speech conversion
- Voice-to-text recording
- Script templates and customization

### 11. File Management
**Route**: `/files`

**Features**:
- Upload and organize files
- Document storage and retrieval
- File sharing within teams
- Secure file access controls

## Detailed Feature Guide

### Campaign Creation Workflow

1. **Basic Campaign Details**:
   - Campaign name and platform selection
   - Budget allocation
   - Campaign objectives (Lead Generation, Brand Awareness, etc.)

2. **Creative Elements**:
   - Headlines with character limits
   - Ad descriptions
   - Image uploads and management

3. **Targeting Options**:
   - Geographic targeting with location selection
   - Demographic targeting (age, gender)
   - Interest-based targeting

4. **Publishing**:
   - Save as draft for later review
   - Publish directly to Meta/Facebook (campaigns created in "Paused" status)

### Lead Integration Process

1. **Source Configuration**:
   - Configure API credentials for various platforms
   - Enable/disable specific lead sources
   - Set up Facebook Lead Forms

2. **Synchronization**:
   - Manual sync triggers
   - Automated lead pulling
   - Lead deduplication and processing

3. **Assignment**:
   - Automatic lead assignment rules
   - Manual lead assignment
   - Load balancing across team members

### Prospect Discovery

1. **Google Maps Scraping**:
   - Search by business categories
   - Geographic area targeting
   - Contact information extraction

2. **Apify Integration**:
   - Automated contact discovery
   - Bulk prospect import
   - Data validation and cleaning

## Integration Capabilities

### 1. Facebook/Meta Integration
- OAuth authentication
- Ad account and page management
- Campaign creation and management
- Lead form integration
- Performance data synchronization

### 2. Google Services
- Gmail integration for email management
- Google Sheets for data organization
- Google Maps for location services

### 3. Real Estate Portals
- MagicBricks integration
- 99acres connectivity
- Housing.com integration
- Automated property synchronization

### 4. Communication Platforms
- WhatsApp Business API
- Email SMTP configurations
- Voice services integration

### 5. Data Collection
- Apify for web scraping
- Custom API integrations
- Bulk data import tools

## Workflow Automation
**Route**: `/workflows`

**Features**:
- Automated workflow creation
- Lead scoring configuration
- Commission tracking
- Rule-based automation
- Workflow templates
- Instance management

## Administration
**Route**: `/admin`

**Administrative Features**:
- User role management (Admin, Manager, Staff)
- User invitations and onboarding
- System-wide settings
- Integration management
- Data access controls

### User Roles & Permissions

1. **Admin**:
   - Full system access
   - User management
   - Integration configuration
   - System settings

2. **Manager**:
   - Team management
   - Lead assignment
   - Report access
   - Project oversight

3. **Staff**:
   - Basic CRM functions
   - Assigned leads/prospects
   - Task management
   - Limited reporting

## Integration Management
**Route**: `/integrations`

**Available Integrations**:

### Marketing Platforms
- Facebook/Meta Ads
- Google Ads (configurable)
- Email marketing platforms

### Communication Tools
- WhatsApp Business
- Email providers (Gmail, SMTP)
- SMS services

### Real Estate Portals
- MagicBricks
- 99acres
- Housing.com
- Callyzer

### Data Sources
- Google Maps scraping
- Apify web scraping
- Custom API connections

## Technical Features

### Data Management
- Secure Supabase backend
- Real-time data synchronization
- Automated backups
- Data export capabilities

### Security
- Row-level security (RLS)
- User authentication and authorization
- Secure API communications
- Data encryption

### Performance
- Optimized queries
- Caching mechanisms
- Responsive design
- Mobile-friendly interface

## Support & Legal

### Legal Pages
- **Terms and Conditions**: `/terms`
- **Privacy Policy**: `/privacy` 
- **Data Deletion**: `/data-deletion`

### Authentication
- Secure login/logout
- Password recovery
- Account management

## Best Practices

### Project Organization
1. Create projects for each real estate development or campaign
2. Use consistent naming conventions
3. Assign team members appropriately
4. Regularly update project status

### Lead Management
1. Configure integrations before starting campaigns
2. Set up automated assignment rules
3. Regularly sync lead sources
4. Maintain clean contact data

### Campaign Optimization
1. Start with small budgets for testing
2. Monitor performance regularly
3. A/B test creative elements
4. Use targeting insights for optimization

### Team Collaboration
1. Use task assignments for accountability
2. Maintain communication through the messaging system
3. Share knowledge through the knowledge base
4. Regular reporting and reviews

## Getting Help

### In-App Support
- Check the Knowledge Base for tutorials
- Use the integrated help sections
- Contact system administrators

### Training Resources
- Video tutorials in Knowledge Base
- Step-by-step guides
- Best practice documentation

This comprehensive CRM system is designed to streamline real estate operations from lead generation to deal closure, providing all necessary tools for modern real estate professionals.
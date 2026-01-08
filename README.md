# Work Order Timeline

> An interactive timeline component for managing work orders across multiple work centers in a manufacturing ERP system.

![Angular](https://img.shields.io/badge/Angular-17+-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Styling-pink?logo=sass)

## 📋 Overview

This application provides a visual interface for planning and managing work orders across different work centers. It allows users to:

- **Visualize** all scheduled work orders at a glance
- **Switch** between Day, Week, and Month views for different planning horizons
- **Create** new work orders by clicking on the timeline
- **Edit** existing work orders with inline actions
- **Delete** work orders when no longer needed
- **Prevent conflicts** with automatic overlap detection

## ✨ Key Features

### Timeline Grid
- **Multi-level zoom**: Day, Week, and Month views
- **Horizontal scrolling**: Navigate through time while keeping work centers fixed
- **Current day indicator**: Visual marker showing today's date
- **Row hover states**: Interactive feedback on work center rows

### Work Order Management
- **Visual status indicators**: Color-coded badges (Open, In Progress, Complete, Blocked)
- **Click-to-create**: Click any empty timeline area to create a new work order
- **Inline editing**: Three-dot menu on each work order bar for quick actions
- **Smart validation**: Prevents overlapping work orders on the same work center
- **localStorage Persistence**: Work orders are automatically saved and restored across page refreshes

### Form Validation
- Required field validation
- Date range validation (end date must be after start date)
- Overlap detection with clear error messages
- Pre-filled dates based on click position

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v17 or higher)

```bash
npm install -g @angular/cli
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/csvinicius/work-order-timeline.git
cd work-order-timeline
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm start
# or
ng serve
```

4. **Open your browser**
```
http://localhost:4200
```

The application will automatically reload when you make changes to the source files.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── timeline/              # Main timeline component
│   │   ├── work-order-panel/      # Create/Edit slide-out panel
│   │   └── work-order-bar/        # Individual work order display
│   ├── models/                    # TypeScript interfaces
│   │   ├── work-center.model.ts
│   │   └── work-order.model.ts
│   ├── services/
│   │   ├── work-center.service.ts # Work center data management
│   │   └── work-order.service.ts  # Work order CRUD operations
│   └── data/
│       └── sample-data.ts         # Hardcoded sample data
├── assets/
└── styles/
    └── styles.scss                # Global styles
```

## 🎨 Design Implementation

This project follows the design specifications from the provided [Sketch](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667)

## 🛠️ Technology Stack

### Core
- **Angular 17+**: Standalone components with modern architecture
- **TypeScript 5+**: Strict mode enabled for type safety
- **SCSS**: Modular styling with component-scoped styles

### UI Components
- **@ng-bootstrap/ng-bootstrap**: Datepicker component
- **@ng-select/ng-select**: Dropdown/select components
- **Reactive Forms**: FormGroup and FormControl for robust form handling

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **RxJS**: Reactive programming for data streams
- **ESLint**: Code linting and quality

## 💡 Key Implementation Details

### Date Positioning Algorithm
Work order bars are positioned on the timeline using a date-to-pixel conversion:

```typescript
// Calculate position based on date relative to visible range
const daysDiff = differenceInDays(startDate, visibleStartDate);
const position = daysDiff * columnWidth;
```

### Overlap Detection
Before creating or updating a work order, the system checks for conflicts:

```typescript
// Exclude current order when editing, check all others
const hasOverlap = existingOrders
  .filter(order => order.workCenterId === selectedWorkCenter)
  .some(order => datesOverlap(order.startDate, order.endDate, newStartDate, newEndDate));
```

### Zoom Level Scaling
The timeline dynamically adjusts column widths based on the selected zoom level:
- **Day view**: Each column represents 1 day
- **Week view**: Each column represents 1 week
- **Month view**: Each column represents 1 month

## 📊 Sample Data

The application includes hardcoded sample data with:
- **5 Work Centers**: Genesis Hardware, Rodriques Electrics, Konsulting Inc, McMarrow Distribution, Spartan Manufacturin
- **8+ Work Orders**: Distributed across different centers with varying statuses
- **All status types**: Open, In Progress, Complete, and Blocked represented
- **Realistic scenarios**: Multiple non-overlapping orders on the same work center

## 🎯 User Interactions

| Action | Result |
|--------|--------|
| Click empty timeline area | Opens Create panel with pre-filled start date |
| Click work order bar | Opens Edit panel with existing data |
| Click three-dot menu | Shows Edit/Delete options |
| Select Delete | Removes work order immediately |
| Change Timescale dropdown | Updates timeline zoom level |
| Horizontal scroll | Scrolls timeline (work centers stay fixed) |
| Hover on row | Highlights row background |

## 📝 Validation Rules

- **Work Order Name**: Required field
- **Status**: Required, must be one of: Open, In Progress, Complete, Blocked
- **Start Date**: Required, cannot be empty
- **End Date**: Required, must be after start date
- **Overlap Prevention**: Work orders on the same work center cannot overlap in time

## 🚧 Future Enhancements

Potential improvements for future iterations:

- **Drag & Drop**: Move work orders by dragging bars on the timeline
- **Resize Bars**: Adjust work order duration by dragging bar edges
- **Today Button**: Quick navigation to center timeline on current date
- **Infinite Scroll**: Dynamically load date columns as user scrolls
- **Tooltips**: Show full work order details on hover
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Export/Import**: Save and load work order schedules
- **Multi-select**: Batch operations on multiple work orders
- **Undo/Redo**: Action history management

## 👨🏻‍💻 Developer

**Vinicius Sousa**
- GitHub: [@csvinicius](https://github.com/csvinicius)

---

**Built with ❤️ using Angular 17+**
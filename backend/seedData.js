const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Warehouse = require('./src/models/Warehouse');
const Vehicle = require('./src/models/Vehicle');
const Driver = require('./src/models/Driver');
const Shipment = require('./src/models/Shipment');
const Expense = require('./src/models/Expense');
const Salary = require('./src/models/Salary');
const WarehouseCapacity = require('./src/models/WarehouseCapacity');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding sample data...');

    // 1. Ensure customer user exists
    const customerEmail = 'customer@velanx.com';
    let customerUser = await User.findOne({ email: customerEmail });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'John Customer',
        email: customerEmail,
        phone: '9999912345',
        password: 'Password@123',
        role: 'customer',
        isActive: true,
      });
      console.log('✅ Created customer user: customer@velanx.com');
    } else {
      console.log('ℹ️ Customer user already exists');
    }

    // Get reference to other users
    const driverUser = await User.findOne({ email: 'driver@velanx.com' });
    const warehouseManagerUser = await User.findOne({ email: 'warehouse_manager@velanx.com' });
    const accountantUser = await User.findOne({ email: 'accountant@velanx.com' });
    const adminUser = await User.findOne({ email: 'admin@velanx.com' });

    if (!driverUser || !warehouseManagerUser || !accountantUser || !adminUser) {
      console.error('❌ Base users not found. Run seedUsers.js first.');
      process.exit(1);
    }

    // Clear existing operational data to avoid duplicates/stale state
    await Warehouse.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Shipment.deleteMany({});
    await Expense.deleteMany({});
    await Salary.deleteMany({});
    await WarehouseCapacity.deleteMany({});
    console.log('🗑️ Cleared existing operational collections (Warehouse, Vehicle, Driver, Shipment, Expense, Salary, WarehouseCapacity)');

    // 2. Seed Warehouses
    const warehousesData = [
      {
        warehouseName: 'Chennai Hub',
        warehouseCode: 'WH-CHE-101',
        location: {
          street: '12 GST Road, Guindy',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600032',
          coordinates: { lat: 13.0067, lng: 80.2206 }
        },
        manager: warehouseManagerUser._id,
        capacity: 1000,
        currentLoad: 420,
        warehouseType: 'origin',
        status: 'active',
        contactPhone: '9876543210',
        operatingHours: { open: '08:00', close: '22:00' }
      },
      {
        warehouseName: 'Bangalore Hub',
        warehouseCode: 'WH-BLR-202',
        location: {
          street: '56 Outer Ring Road, Mahadevapura',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560048',
          coordinates: { lat: 12.9856, lng: 77.6961 }
        },
        manager: warehouseManagerUser._id,
        capacity: 1200,
        currentLoad: 950,
        warehouseType: 'transit',
        status: 'active',
        contactPhone: '9876543211',
        operatingHours: { open: '00:00', close: '23:59' }
      },
      {
        warehouseName: 'Mumbai Hub',
        warehouseCode: 'WH-BOM-303',
        location: {
          street: '78 Sion-Trombay Road, Chembur',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400071',
          coordinates: { lat: 19.0618, lng: 72.8826 }
        },
        manager: warehouseManagerUser._id,
        capacity: 1500,
        currentLoad: 1450,
        warehouseType: 'destination',
        status: 'full',
        contactPhone: '9876543212',
        operatingHours: { open: '08:00', close: '22:00' }
      },
      {
        warehouseName: 'Delhi Hub',
        warehouseCode: 'WH-DEL-404',
        location: {
          street: '34 Okhla Industrial Area',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110020',
          coordinates: { lat: 28.5355, lng: 77.2639 }
        },
        manager: warehouseManagerUser._id,
        capacity: 800,
        currentLoad: 120,
        warehouseType: 'general',
        status: 'active',
        contactPhone: '9876543213',
        operatingHours: { open: '09:00', close: '21:00' }
      }
    ];

    const warehouses = await Warehouse.insertMany(warehousesData);
    console.log(`✅ Seeded ${warehouses.length} warehouses`);

    // 3. Seed Vehicles
    const vehiclesData = [
      {
        vehicleNumber: 'TN-01-AB-1234',
        vehicleType: 'truck',
        brand: 'Tata',
        model: 'Ultra T.7',
        year: 2023,
        capacity: 7.5,
        status: 'available',
        maintenanceStatus: 'good',
        lastMaintenanceDate: new Date('2026-05-10'),
        nextMaintenanceDate: new Date('2026-08-10'),
        fuelType: 'diesel',
        insuranceExpiry: new Date('2027-01-15'),
        pucExpiry: new Date('2026-12-15'),
        registrationExpiry: new Date('2038-05-10')
      },
      {
        vehicleNumber: 'KA-03-CD-5678',
        vehicleType: 'container',
        brand: 'Ashok Leyland',
        model: 'Ecomet 1615',
        year: 2022,
        capacity: 16,
        status: 'in_use',
        maintenanceStatus: 'good',
        lastMaintenanceDate: new Date('2026-04-15'),
        nextMaintenanceDate: new Date('2026-07-15'),
        fuelType: 'diesel',
        insuranceExpiry: new Date('2027-02-20'),
        pucExpiry: new Date('2026-10-20'),
        registrationExpiry: new Date('2037-04-15')
      },
      {
        vehicleNumber: 'MH-02-EF-9012',
        vehicleType: 'van',
        brand: 'Mahindra',
        model: 'Supro Profitt Truck',
        year: 2024,
        capacity: 1.5,
        status: 'available',
        maintenanceStatus: 'needs_service',
        lastMaintenanceDate: new Date('2026-01-20'),
        nextMaintenanceDate: new Date('2026-06-20'),
        fuelType: 'cng',
        insuranceExpiry: new Date('2026-07-20'),
        pucExpiry: new Date('2026-07-20'),
        registrationExpiry: new Date('2039-01-20')
      },
      {
        vehicleNumber: 'DL-01-GH-3456',
        vehicleType: 'lorry',
        brand: 'BharatBenz',
        model: '2823R',
        year: 2021,
        capacity: 28,
        status: 'maintenance',
        maintenanceStatus: 'in_service',
        lastMaintenanceDate: new Date('2026-06-15'),
        nextMaintenanceDate: new Date('2026-09-15'),
        fuelType: 'diesel',
        insuranceExpiry: new Date('2026-12-30'),
        pucExpiry: new Date('2026-09-30'),
        registrationExpiry: new Date('2036-06-15')
      }
    ];

    const vehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`✅ Seeded ${vehicles.length} vehicles`);

    // 4. Seed Drivers
    const driversData = [
      {
        user: driverUser._id,
        licenseNumber: 'DL-TN01-20150045612',
        status: 'busy',
        assignedVehicle: vehicles[1]._id, // KA-03-CD-5678 (in_use)
        currentLocation: { lat: 12.9716, lng: 77.5946, updatedAt: new Date() },
        completedDeliveries: 128,
        rating: 4.8,
        totalRatings: 42,
        experience: 8,
        joiningDate: new Date('2022-03-10')
      }
    ];

    // Create secondary driver user & driver profile to have more data
    const driver2User = await User.findOne({ email: 'driver2@velanx.com' }) || await User.create({
      name: 'Ramesh Driver',
      email: 'driver2@velanx.com',
      phone: '9999967890',
      password: 'Password@123',
      role: 'driver',
      isActive: true,
    });
    console.log('ℹ️ Driver2 user setup completed');

    driversData.push({
      user: driver2User._id,
      licenseNumber: 'DL-KA03-20180098741',
      status: 'active',
      assignedVehicle: vehicles[0]._id, // TN-01-AB-1234 (available)
      currentLocation: { lat: 13.0827, lng: 80.2707, updatedAt: new Date() },
      completedDeliveries: 45,
      rating: 4.5,
      totalRatings: 18,
      experience: 4,
      joiningDate: new Date('2024-05-15')
    });

    const drivers = await Driver.insertMany(driversData);
    console.log(`✅ Seeded ${drivers.length} drivers`);

    // Link vehicle to driver
    await Vehicle.findByIdAndUpdate(vehicles[0]._id, { assignedDriver: drivers[1]._id });
    await Vehicle.findByIdAndUpdate(vehicles[1]._id, { assignedDriver: drivers[0]._id });

    // Helper to generate tracking number manually before inserting/creating
    const generateTrackingNumber = () => {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `VLX-${timestamp}-${random}`;
    };

    // 5. Seed Shipments using Shipment.create so save hooks execute or set manually
    const shipmentsData = [
      {
        trackingNumber: generateTrackingNumber(),
        customer: customerUser._id,
        pickupAddress: {
          street: '100 Feet Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
          coordinates: { lat: 12.9719, lng: 77.6412 }
        },
        deliveryAddress: {
          street: 'Nungambakkam High Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600034',
          coordinates: { lat: 13.0607, lng: 80.2411 }
        },
        materialName: 'Electronics Components',
        materialWeight: 1.2, // tons
        quantity: 50,
        shipmentType: 'interstate',
        status: 'delivery_confirmed', // Changed from delivered to delivery_confirmed to record revenue
        assignedDriver: drivers[1]._id,
        assignedVehicle: vehicles[0]._id,
        estimatedDelivery: new Date('2026-06-20'),
        actualDelivery: new Date('2026-06-20'),
        pricing: {
          basePrice: 15000,
          weightCharge: 10000,
          distanceCharge: 10000,
          total: 35000 // Tally: $35,000
        },
        receiverName: 'Apex Electronics',
        receiverPhone: '9845012345',
        specialInstructions: 'Fragile. Handle with care.'
      },
      {
        trackingNumber: generateTrackingNumber(),
        customer: customerUser._id,
        pickupAddress: {
          street: '34 Sipcot Phase 2',
          city: 'Hosur',
          state: 'Tamil Nadu',
          pincode: '635109',
          coordinates: { lat: 12.7275, lng: 77.8633 }
        },
        deliveryAddress: {
          street: 'Marol Naka, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400059',
          coordinates: { lat: 19.1128, lng: 72.8753 }
        },
        materialName: 'Industrial Springs',
        materialWeight: 8.5,
        quantity: 12,
        shipmentType: 'interstate',
        status: 'in_transit',
        assignedDriver: drivers[0]._id,
        assignedVehicle: vehicles[1]._id,
        estimatedDelivery: new Date('2026-06-28'),
        pricing: {
          basePrice: 10000,
          weightCharge: 8000,
          distanceCharge: 7000,
          total: 25000 // In progress shipment: $25,000
        },
        receiverName: 'Sagar Machinery Corp',
        receiverPhone: '9008054321',
        warehouseHistory: [
          {
            warehouse: warehouses[0]._id,
            warehouseName: warehouses[0].warehouseName,
            arrivedAt: new Date('2026-06-23T10:00:00Z'),
            dispatchedAt: new Date('2026-06-24T06:00:00Z'),
            status: 'dispatched',
            handledBy: warehouseManagerUser._id
          },
          {
            warehouse: warehouses[1]._id,
            warehouseName: warehouses[1].warehouseName,
            arrivedAt: new Date('2026-06-24T09:30:00Z'),
            status: 'received',
            handledBy: warehouseManagerUser._id
          }
        ]
      },
      {
        trackingNumber: generateTrackingNumber(),
        customer: customerUser._id,
        pickupAddress: {
          street: '7th Avenue, Anna Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600040',
          coordinates: { lat: 13.0850, lng: 80.2101 }
        },
        deliveryAddress: {
          street: 'Vandipalayam Road',
          city: 'Cuddalore',
          state: 'Tamil Nadu',
          pincode: '607004',
          coordinates: { lat: 11.7480, lng: 79.7714 }
        },
        materialName: 'Cotton Yarn Bales',
        materialWeight: 3.5,
        quantity: 35,
        shipmentType: 'local',
        status: 'delivery_confirmed', // Changed to delivery_confirmed
        pricing: {
          basePrice: 20000,
          weightCharge: 12000,
          distanceCharge: 10000,
          total: 42000 // Tally: $42,000
        },
        receiverName: 'Velan Textiles',
        receiverPhone: '9443214567',
        estimatedDelivery: new Date('2026-06-26')
      },
      {
        trackingNumber: generateTrackingNumber(),
        customer: customerUser._id,
        pickupAddress: {
          street: '15 Infantry Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          coordinates: { lat: 12.9818, lng: 77.5951 }
        },
        deliveryAddress: {
          street: 'Kothrud Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411038',
          coordinates: { lat: 18.5074, lng: 73.8077 }
        },
        materialName: 'Office Furniture',
        materialWeight: 2.1,
        quantity: 22,
        shipmentType: 'interstate',
        status: 'delivery_confirmed', // Changed to delivery_confirmed
        assignedDriver: drivers[1]._id,
        assignedVehicle: vehicles[0]._id,
        pricing: {
          basePrice: 8000,
          weightCharge: 5500,
          distanceCharge: 5000,
          total: 18500 // Tally: $18,500
        },
        receiverName: 'Nutan Tech Solutions',
        receiverPhone: '7766554433',
        estimatedDelivery: new Date('2026-06-27')
      }
    ];

    const shipments = await Shipment.create(shipmentsData);
    console.log(`✅ Seeded ${shipments.length} shipments`);

    // 6. Seed Expenses
    const expensesData = [
      {
        category: 'fuel',
        amount: 8500,
        description: 'Diesel top-up for Bangalore-Mumbai trip',
        date: new Date('2026-06-23'),
        vehicle: vehicles[1]._id,
        driver: drivers[0]._id,
        recordedBy: accountantUser._id,
        approvedBy: adminUser._id,
        status: 'approved'
      },
      {
        category: 'vehicle_maintenance',
        amount: 14200,
        description: 'Breakpad and air filter replacement for DL-01-GH-3456',
        date: new Date('2026-06-16'),
        vehicle: vehicles[3]._id,
        recordedBy: accountantUser._id,
        approvedBy: adminUser._id,
        status: 'approved'
      },
      {
        category: 'warehouse',
        amount: 25000,
        description: 'Safety equipment & pallet jack maintenance at Bangalore Hub',
        date: new Date('2026-06-10'),
        recordedBy: accountantUser._id,
        status: 'pending'
      },
      {
        category: 'driver_advance',
        amount: 3000,
        description: 'Toll and food allowance for Interstate trip',
        date: new Date('2026-06-23'),
        driver: drivers[1]._id,
        recordedBy: accountantUser._id,
        approvedBy: adminUser._id,
        status: 'approved'
      }
    ];

    const expenses = await Expense.insertMany(expensesData);
    console.log(`✅ Seeded ${expenses.length} expenses`);

    // 7. Seed Salaries
    const salariesData = [
      {
        employee: driverUser._id,
        role: 'driver',
        basicSalary: 18000,
        allowances: { fuel: 2000, travel: 1500, other: 500 },
        deductions: { tax: 800, pf: 1800, other: 0 },
        month: 5,
        year: 2026,
        paymentStatus: 'paid',
        paidAt: new Date('2026-05-31'),
        remarks: 'Salary credited on time',
        processedBy: accountantUser._id
      },
      {
        employee: warehouseManagerUser._id,
        role: 'warehouse_manager',
        basicSalary: 32000,
        allowances: { fuel: 1000, travel: 0, other: 2000 },
        deductions: { tax: 2200, pf: 3200, other: 0 },
        month: 5,
        year: 2026,
        paymentStatus: 'paid',
        paidAt: new Date('2026-05-31'),
        remarks: 'Salary credited on time',
        processedBy: accountantUser._id
      },
      {
        employee: driver2User._id,
        role: 'driver',
        basicSalary: 16500,
        allowances: { fuel: 1500, travel: 1000, other: 0 },
        deductions: { tax: 500, pf: 1650, other: 100 },
        month: 5,
        year: 2026,
        paymentStatus: 'paid',
        paidAt: new Date('2026-05-31'),
        remarks: 'Salary credited on time',
        processedBy: accountantUser._id
      }
    ];

    // Calculate netSalary manually to bypass mongoose pre-save hook bug
    salariesData.forEach(sal => {
      const allowancesVal = Object.values(sal.allowances).reduce((a, b) => a + b, 0);
      const deductionsVal = Object.values(sal.deductions).reduce((a, b) => a + b, 0);
      sal.netSalary = sal.basicSalary + allowancesVal - deductionsVal;
    });

    const salaries = await Salary.insertMany(salariesData);
    console.log(`✅ Seeded ${salaries.length} salary records`);

    // 8. Seed Warehouse Capacities (daily records for utilization graphs)
    const capacitiesData = [];
    // Last 7 days for the active warehouses
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Chennai Hub utilization variation
      capacitiesData.push({
        warehouse: warehouses[0]._id,
        totalCapacity: warehouses[0].capacity,
        currentLoad: 350 + Math.floor(Math.random() * 150),
        utilizationPercentage: 0, // calculated below
        incomingShipmentsCount: 3 + Math.floor(Math.random() * 4),
        outgoingShipmentsCount: 2 + Math.floor(Math.random() * 4),
        status: 'normal',
        date: new Date(date)
      });

      // Bangalore Hub utilization variation
      capacitiesData.push({
        warehouse: warehouses[1]._id,
        totalCapacity: warehouses[1].capacity,
        currentLoad: 800 + Math.floor(Math.random() * 200),
        utilizationPercentage: 0,
        incomingShipmentsCount: 8 + Math.floor(Math.random() * 6),
        outgoingShipmentsCount: 7 + Math.floor(Math.random() * 5),
        status: 'normal',
        date: new Date(date)
      });
    }

    // Map utilization percentage
    capacitiesData.forEach(cap => {
      cap.utilizationPercentage = Math.round((cap.currentLoad / cap.totalCapacity) * 100);
      if (cap.utilizationPercentage >= 90) cap.status = 'critical';
      else if (cap.utilizationPercentage >= 80) cap.status = 'warning';
    });

    const capacities = await WarehouseCapacity.insertMany(capacitiesData);
    console.log(`✅ Seeded ${capacities.length} warehouse capacity logs`);

    console.log('🎉 Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();

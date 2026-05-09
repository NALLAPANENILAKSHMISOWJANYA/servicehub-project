import Service from '../models/Service.js';

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const services = await Service.find({ ...keyword, ...category }).populate('vendorId', 'name');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('vendorId', 'name');
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Vendor
export const createService = async (req, res) => {
  try {
    const { title, description, category, price, image } = req.body;

    const service = new Service({
      title,
      description,
      category,
      price,
      image: image || 'https://via.placeholder.com/300',
      vendorId: req.user._id,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor's services
// @route   GET /api/services/vendor
// @access  Private/Vendor
export const getVendorServices = async (req, res) => {
  try {
    const services = await Service.find({ vendorId: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

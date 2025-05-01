const Settings = require('../models/Settings');

// Get site settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSiteSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get public site settings (no auth required)
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.getSiteSettings();
    
    // Only return non-sensitive settings that are needed by public pages
    const publicSettings = {
      siteName: settings.siteName || 'TechShethra',
      eventYear: settings.eventYear || new Date().getFullYear(),
      paymentQrCode: settings.paymentQrCode || '',
      upiId: settings.upiId || 'organizers@techshethra',
      paymentInstructions: settings.paymentInstructions || '',
      contactEmail: settings.contactEmail || 'contact@techshethra.com',
      contactPhone: settings.contactPhone || '',
      socialLinks: settings.socialLinks || {},
      registrationsEnabled: settings.registrationsEnabled !== false
    };
    
    res.json(publicSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update site settings
exports.updateSettings = async (req, res) => {
  try {
    // Find the settings document, or create if doesn't exist
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update the fields that are present in the request
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        if (key === 'socialLinks') {
          // Update nested social links object
          Object.keys(updates.socialLinks).forEach(social => {
            settings.socialLinks[social] = updates.socialLinks[social];
          });
        } else {
          settings[key] = updates[key];
        }
      }
    });

    settings.updatedAt = Date.now();
    const updatedSettings = await settings.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 
import Settings from "../models/settings.js";

// Get settings
export const getSettings = async (req, res) => {
  console.log(req.user);
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.log("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const {
      blogName,
      blogDescription,
      heroTitle,
      heroSubtitle,
      twitter,
      linkedin,
      github,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({});
    }

    // Update fields
    if (blogName !== undefined) settings.blogName = blogName;
    if (blogDescription !== undefined) settings.blogDescription = blogDescription;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (twitter !== undefined) settings.twitter = twitter;
    if (linkedin !== undefined) settings.linkedin = linkedin;
    if (github !== undefined) settings.github = github;
    if (metaTitle !== undefined) settings.metaTitle = metaTitle;
    if (metaDescription !== undefined) settings.metaDescription = metaDescription;
    if (metaKeywords !== undefined) settings.metaKeywords = metaKeywords;

    settings.updatedAt = new Date();
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message
    });
  }
};


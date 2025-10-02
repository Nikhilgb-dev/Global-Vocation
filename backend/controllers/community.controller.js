import Community from "../models/community.model.js";

// CREATE
export const createCommunity = async (req, res) => {
  try {
    const community = await Community.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(community);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate(
      "createdBy",
      "name email"
    );
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!community)
      return res.status(404).json({ message: "Community not found" });
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!community)
      return res.status(404).json({ message: "Community not found" });
    res.json(community);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });
    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

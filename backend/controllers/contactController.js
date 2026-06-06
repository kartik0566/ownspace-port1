import ContactSubmission from '../models/ContactSubmission.js';
import { ownerFilter, pick, readScope } from '../utils/ownership.js';

export const submitContact = async (req, res) => {
  try {
    const scope = await readScope(req, res);
    if (!scope) return;

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Name, email, and message are required' });
    }

    const submission = new ContactSubmission({
      userId: scope.user._id,
      name,
      email,
      message,
    });
    await submission.save();

    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const payload = pick(req.body, ['status', 'reply']);
    const submission = await ContactSubmission.findOneAndUpdate(
      ownerFilter(req),
      payload,
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findOneAndDelete(
      ownerFilter(req)
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

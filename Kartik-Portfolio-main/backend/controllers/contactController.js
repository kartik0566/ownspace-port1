import ContactSubmission from '../models/ContactSubmission.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!name || !email || !message || !userId) {
      return res.status(400).json({
        message: 'Name, email, message and userId are required',
      });
    }

    const submission = new ContactSubmission({
      userId,
      name,
      email,
      message,
    });

    await submission.save();

    res.status(201).json({
      message: 'Message submitted successfully',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!submission) {
      return res.status(404).json({
        message: 'Submission not found',
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!submission) {
      return res.status(404).json({
        message: 'Submission not found',
      });
    }

    res.json({
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
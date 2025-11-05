// server/src/controllers/assignment.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Assignment from '../models/assignment.model';
import Module from '../models/module.model';

// creating assignment
// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private
export const createAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, moduleId, dueDate, status } = req.body;

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    
    const module = await Module.findById(moduleId);

    if (!module) {
      res.status(404);
      throw new Error('Module not found');
    }

    if (module.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to add assignments to this module');
    }

    const assignment = await Assignment.create({
      title,
      dueDate,
      status,
      module: moduleId,
      user: req.user._id,
    });

    res.status(201).json(assignment);
  }
);

// getting assignments for a module
// @desc    Get all assignments for a specific module
// @route   GET /api/modules/:moduleId/assignments
// @access  Private
export const getAssignmentsForModule = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    
    const moduleId = req.params.id;
    const module = await Module.findById(moduleId);

    if (!module) {
      res.status(404);
      throw new Error('Module not found');
    }

    if (module.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to view this module');
    }

    const assignments = await Assignment.find({ module: moduleId }).sort({
      createdAt: 1,
    });

    res.status(200).json(assignments);
  }
);

//updating assignment
// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private
export const updateAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    // find the assignment
    const assignment = await Assignment.findById(req.params.id);

    // check if it exists
    if (!assignment) {
      res.status(404);
      throw new Error('Assignment not found');
    }

    // validate ownership
    if (assignment.user.toString() !== req.user?._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this assignment');
    }

    // update the assignment
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true = output the updated document
    );

    res.status(200).json(updatedAssignment);
  }
);

// deleting assignment
// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private
export const deleteAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404);
      throw new Error('Assignment not found');
    }

    if (assignment.user.toString() !== req.user?._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this assignment');
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: 'Assignment deleted successfully', id: req.params.id });
  }
);
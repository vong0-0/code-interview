import type { Request, Response } from "express"
import { prisma as db } from "../lib/prisma.js"

export async function getQuestions(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { difficulty, search } = req.query

    const questions = await db.question.findMany({
      where: {
        authorId: userId,
        ...(difficulty && {
          difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
        }),
        ...(search && {
          title: { contains: search as string, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        difficulty: true,
        language: true,
        authorId: true,
        createdAt: true,
      },
    })

    res.json({ questions })
  } catch (err) {
    console.error("[getQuestions]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function getQuestion(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { id } = req.params

    const question = await db.question.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        language: true,
        starterCode: true,
        authorId: true,
        createdAt: true,
      },
    })

    if (!question) {
      res.status(404).json({ error: "Question not found" })
      return
    }

    if (question.authorId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    res.json({ question })
  } catch (err) {
    console.error("[getQuestion]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function createQuestion(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const {
      title,
      description,
      difficulty,
      language,
      starterCode,
    } = req.body

    if (!title || !description || !difficulty) {
      res
        .status(400)
        .json({ error: "title, description and difficulty are required" })
      return
    }

    if (!["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      res.status(400).json({ error: "difficulty must be EASY, MEDIUM or HARD" })
      return
    }

    const question = await db.question.create({
      data: {
        title,
        description,
        difficulty,
        language,
        starterCode,
        authorId: userId,
      },
    })

    res.status(201).json({ question })
  } catch (err) {
    console.error("[createQuestion]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function updateQuestion(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { id } = req.params
    const {
      title,
      description,
      difficulty,
      language,
      starterCode,
    } = req.body

    const question = await db.question.findUnique({ where: { id } })

    if (!question) {
      res.status(404).json({ error: "Question not found" })
      return
    }

    if (question.authorId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    if (difficulty && !["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      res.status(400).json({ error: "difficulty must be EASY, MEDIUM or HARD" })
      return
    }

    const updated = await db.question.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(difficulty && { difficulty }),
        ...(language !== undefined && { language }),
        ...(starterCode !== undefined && { starterCode }),
      },
    })

    res.json({ question: updated })
  } catch (err) {
    console.error("[updateQuestion]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const userId = req.user.id
    const { id } = req.params

    const question = await db.question.findUnique({ where: { id } })

    if (!question) {
      res.status(404).json({ error: "Question not found" })
      return
    }

    if (question.authorId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    await db.question.delete({ where: { id } })

    res.json({ message: "Question deleted" })
  } catch (err) {
    console.error("[deleteQuestion]", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

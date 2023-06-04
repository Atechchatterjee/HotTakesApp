# Tech Stack we will be using

The technologies that I have chosen to work with are listed below:

- **React**: Frontend framework / Library
- **Nextjs:** Used for both frontend and backend.
- **Tailwind:** CSS framework (along with shadcn ui for components)
- **shadcn/ui:** A "component library" (sort of) built on top of **tailwindcss** and **radix UI**
- **tRPC:** Efficient and typesafe way to connect your frontend and backend

# Idea Behind the HotTakesApp

In the current world of ever changing tech, we have quite a lot of interesting **topics** that we as developers are constantly discussing about. This app for developers to get their opinions and hot-takes about specific topic out and open in the world. It would allow the community to have discussion / debate on various topics and hopefully have fun and learn something more about the tech.

# How it works (Some Ground Rules)

The user would have two options to sign in as - an **"author"** or **"normie"**.

### **Power of Authors**:

- Authors would have their on communities that other **normies** can follow and be a part of.
- The authors are reponsible for creating **"topics"** and start a discussion on the specific topic.
- The discussion will have a life span specified by the **author**.
- The author will give their own take on the topic and can add on or update their take in due course of time.
- Number of **topics they are able to create per week** will **depend on the amount of credibility** they have.

### **Power of Normies**:

- Normies would **not** be able to create **"topics"** like the authors but would be able to take part in them.
- Normies would **gain crediblity points** by taking part in discussions.
- Once their credibility point exceeds a limit, they would be given the privilege of **becoming an author**.
- The can **challenge** the hot-take given by the author or other fellow normies. Winning a challenge would give them a significant boost in their credibility.

### **Types of Discussions:**

- **Normal Discussion**:

  - Every normie would be able to make **one take** on the topic of discussion.
  - The take is **editable**.
  - Every "take" is **challengable**.
  - Whenever a "take" is challenged **a new thread** is created based on the challenge.
  - Every challenge will have **a winner and a loser**.
  - The winner will be decided by **community votes**.
  - The winner will **gain a significant boost** in their credibility point.
  - The loser will have to pay the cost by **loosing some credibility points**.

    **NOTE:** The amount of **point lost will be** **0.05%** of the total credibility point that the normie has. Even the **authors can lose credibility points** but only upto a **certain limit**.

- **Debate** (For or Against a particular topic):
  - This form of discussion will consists of two kinds of take (like a traditional debate): **For** or **Against**.
  - A normie has to choose **either one side** and give their own takes.
  - **No one to one challenges** are allowed here.
  - Every debate may have some number of **spectators** i.e. normies that are not taking part in the debate.
  - A winner will be decided from votes from **spectators**.

## **Selection of authors:**

Initially the authors will be selected based on their **social credibility** (like being a well known personality in the tech world, prominant youtuber, a creator of well known open source projects, having very good contribution history in the open source world, etc.).

Authors can also be selected based on recommendation of other authors.

**NOTE:** **More than one authors** are required to select another author.

## **Power of the Community** (includes both authors and normies):

All though the authors might seem more powerful, but in reality the community is the all powerful entity in this app. Winners and Losers of different challenges and debates are all decided by the community collectively.

Also the community all together holds enough power to **ban an author**, if the community deems that is necessary.

Moral of the story: The **community is all-powerful**.

**NOTE:** This app is Still in development and more rules will be added soon.

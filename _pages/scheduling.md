---
title: "Scheduling"
description: "Schedule production work orders in Fraction ERP. Use forward and backward scheduling to optimize shop floor capacity and meet delivery dates."
section: "Works Orders"
---

# Scheduling

## How Auto-Scheduling Works

### What it does

Auto-schedule finds the earliest available time slot for each operation based on workcenter capacity, working hours, and existing workload. Operations are scheduled in sequence so each one starts after the previous one finishes.

### What gets rescheduled

- All **Planned** and **Ready** operations, including ones you have manually moved
- Operations scheduled in the past that haven't been started

### What stays put

- **Pinned operations** — use the pin icon to lock an operation in place
- **In Progress operations** — already being worked on
- **Completed operations** — finished work is never moved

### Scheduling rules

- Operations respect workcenter working hours — no work is scheduled outside shift times or on non-working days
- Break times are skipped — operations pause during breaks and resume after
- Weekends and holidays are skipped unless the workcenter is configured to work those days
- Operations are scheduled in sequence order (Op 10 before Op 20, etc.)
- If a workcenter is busy with other work orders, the operation waits for the next available slot

### Settings

- **Buffer Time** — adds a gap (in minutes) between consecutive operations, useful for setup or transfer time
- **Backward Scheduling** — schedules operations backwards from the work order due date, so the last operation finishes just before the deadline
- **Schedule Child WO First** — prioritises child work orders so their parts are ready before the parent work order needs them

### Tips

- Pin an operation to lock it in place — auto-schedule will work around it
- Drag and drop to manually adjust an operation's position on the Gantt chart
- Running auto-schedule will override any previous drag-and-drop placements (unless pinned)

## Video Tutorial

<div class="video-container">
  <iframe src="https://player.vimeo.com/video/1110726912" title="Scheduling" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>


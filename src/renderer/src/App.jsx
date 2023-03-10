import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isContain, isMatch, saveData, readData } from './functions'
import Help from './Help'

const App = () => {
  const [tasks, setTasks] = useState([])
  const [content, setContent] = useState('')
  const [contentEdit, setContentEdit] = useState('')
  const [format, setFormat] = useState('')
  const [formatEdit, setFormatEdit] = useState('')
  const [editedTasks, setEditedTasks] = useState([])
  const [mode, setMode] = useState('Normal')
  const [isScrolling, setScrolling] = useState(false)
  const [isScrollUp, setScrollUp] = useState(false)
  const [isShowHelp, setShowHelp] = useState(false)
  const [isHideCommands, setHideCommands] = useState(false)
  const helpRef = useRef()
  const containerRef = useRef()
  const containerTasksRef = useRef()
  const formatRef = useRef()
  const contentRef = useRef()
  const formatEditRef = useRef()
  const contentEditRef = useRef()

  useEffect(() => {
    getLocalData()
    containerRef.current.focus()
  }, [])

  const getLocalData = async () => {
    let { isHideCommands, tasks } = await readData()
    const today = new Date().toDateString()
    const newTasks = tasks.map((task) => {
      if (task.isRecurring && task.time !== today)
        return {
          ...task,
          isCompleted: false,
          time: today
        }
      return task
    })
    saveData({ isHideCommands, tasks: newTasks })
    setHideCommands(isHideCommands)
    setTasks(newTasks)
  }

  useEffect(() => {
    let container = isShowHelp ? helpRef.current : containerTasksRef.current
    let scrollInterval = null
    let direction = isScrollUp ? -1 : 1
    let time = 10
    scrollInterval = setInterval(() => {
      if (isScrolling) {
        container.scrollBy(0, time * direction)
        time = Math.min(50, time + 0.5)
      } else {
        clearInterval(scrollInterval)
      }
    }, 10)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [isScrolling, mode, isShowHelp])

  useEffect(() => {
    containerTasksRef.current.scrollTo(0, 0)
  }, [mode])

  const getLevel = (format) => {
    let level = 0
    format
      .toLowerCase()
      .split('')
      .forEach((character) => {
        if (character === 't') level = 0
        else if (character === 'u') level = 1
        else if (character === 'i') level = 2
        else if (character === 'v') level = 3
      })
    return level
  }

  const getAllLevels = (format) => {
    let level = []
    if (isContain(format, ['t'])) level.push(0)
    if (isContain(format, ['u'])) level.push(1)
    if (isContain(format, ['i'])) level.push(2)
    if (isContain(format, ['v'])) level.push(3)
    return level
  }

  const getStatus = (format) => {
    let status = false
    format
      .toLowerCase()
      .split('')
      .forEach((character) => {
        if (character === 'p') status = false
        else if (character === 'c') status = true
      })
    return status
  }

  const getRecurring = (format) => {
    let recurring = false
    format
      .toLowerCase()
      .split('')
      .forEach((character) => {
        if (character === 'o') recurring = false
        else if (character === 'r') recurring = true
      })
    return recurring
  }

  const handleInsert = () => {
    if (content.trim().length === 0) return
    setTasks((prev) => {
      const newTasks = [
        {
          id: uuidv4(),
          name: content.trim(),
          level: getLevel(format),
          isCompleted: getStatus(format),
          isRecurring: getRecurring(format)
        },
        ...prev
      ]
      saveData({ isHideCommands, tasks: newTasks })
      return newTasks
    })
    containerTasksRef.current.scrollTo(0, 0)
  }

  const handleToggleState = (target) => {
    if (mode === 'Edit') return
    setTasks((prev) => {
      const newTasks = prev.map((task) => {
        if (task.id === target) {
          if (task.isRecurring && !task.isCompleted)
            return {
              ...task,
              isCompleted: true,
              time: new Date().toDateString()
            }
          return {
            ...task,
            isCompleted: !task.isCompleted
          }
        }
        return task
      })
      saveData({ isHideCommands, tasks: newTasks })
      return newTasks
    })
  }

  const handleDelete = (target) => {
    if (mode === 'Edit') return
    setTasks((prev) => {
      const newTasks = prev.filter((task) => task.id !== target)
      saveData({ isHideCommands, tasks: newTasks })
      return newTasks
    })
  }

  const handleEdit = () => {
    const ids = editedTasks.map((task) => task.id)
    setTasks((prev) => {
      const newTasks = prev.reduce((newTasks, task) => {
        if (ids.includes(task.id)) {
          let targetTask = editedTasks.find((editedTask) => editedTask.id === task.id)
          if (targetTask.isRecurring && targetTask.isCompleted)
            targetTask.time = new Date().toDateString()
          if (targetTask.name.length > 0) newTasks.push(targetTask)
        } else {
          newTasks.push(task)
        }
        return newTasks
      }, [])
      saveData({ isHideCommands, tasks: newTasks })
      return newTasks
    })
    setMode('Filter')
    setContent('')
    setContentEdit('')
    setFormat('')
    setFormatEdit('')
    setEditedTasks([])
    contentRef.current.focus()
  }

  const handleContent = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          break

        case 'i':
          event.stopPropagation()
          if (mode === 'Insert') break
          setMode('Insert')
          setContent('')
          setFormat('')
          break

        case 'f':
          event.stopPropagation()
          if (mode === 'Filter') break
          setMode('Filter')
          setContent('')
          setFormat('')
          break

        case 'e':
          if (mode !== 'Filter') break
          setMode('Edit')
          contentEditRef.current.focus()
          event.stopPropagation()
          break

        default:
          event.stopPropagation()
          break
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          break

        case 'Tab':
          event.preventDefault()
          formatRef.current.focus()
          event.stopPropagation()
          break

        case 'Escape':
          setContent('')
          setFormat('')
          containerRef.current.focus()
          setMode('Normal')
          event.stopPropagation()
          break

        case 'F1':
          event.stopPropagation()
          if (mode === 'Insert') break
          setMode('Insert')
          setContent('')
          setFormat('')
          break

        case 'F2':
          event.stopPropagation()
          if (mode === 'Filter') break
          setMode('Filter')
          setContent('')
          setFormat('')
          break

        case 'F3':
          if (mode !== 'Filter') break
          setMode('Edit')
          contentEditRef.current.focus()
          event.stopPropagation()
          break

        default:
          event.stopPropagation()
          break
      }
    }
  }

  const handleContentEdit = (event) => {
    event.stopPropagation()
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'i':
          if (mode === 'Insert') break
          setMode('Insert')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'f':
          if (mode === 'Filter') break
          setMode('Filter')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        default:
          break
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          handleEdit()
          break

        case 'Tab':
          event.preventDefault()
          formatEditRef.current.focus()
          break

        case 'Escape':
          setMode('Filter')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'F1':
          if (mode === 'Insert') break
          setMode('Insert')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'F2':
          if (mode === 'Filter') break
          setMode('Filter')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        default:
          break
      }
    }
  }

  const handleFormat = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          break

        case 'i':
          event.stopPropagation()
          if (mode === 'Insert') break
          setMode('Insert')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'f':
          event.stopPropagation()
          if (mode === 'Filter') break
          setMode('Filter')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'e':
          event.stopPropagation()
          if (mode !== 'Filter') break
          setMode('Edit')
          contentEditRef.current.focus()
          break

        default:
          event.stopPropagation()
          break
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          break

        case 'Tab':
          event.preventDefault()
          contentRef.current.focus()
          event.stopPropagation()
          break

        case 'Escape':
          setFormat('')
          event.preventDefault()
          contentRef.current.focus()
          event.stopPropagation()
          break

        case 'F1':
          event.stopPropagation()
          if (mode === 'Insert') break
          setMode('Insert')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'F2':
          event.stopPropagation()
          if (mode === 'Filter') break
          setMode('Filter')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'F3':
          event.stopPropagation()
          if (mode !== 'Filter') break
          setMode('Edit')
          contentEditRef.current.focus()
          break

        default:
          event.stopPropagation()
          break
      }
    }
  }

  const handleFormatEdit = (event) => {
    event.stopPropagation()
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'i':
          if (mode === 'Insert') break
          setMode('Insert')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'f':
          if (mode === 'Filter') break
          setMode('Filter')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        default:
          break
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          handleScroll()
          event.preventDefault()
          break

        case 'ArrowUp':
          handleScroll(true)
          event.preventDefault()
          break

        case 'Enter':
          handleEdit()
          break

        case 'Tab':
          event.preventDefault()
          contentEditRef.current.focus()
          break

        case 'Escape':
          setFormatEdit('')
          contentEditRef.current.focus()
          break

        case 'F1':
          if (mode === 'Insert') break
          setMode('Insert')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        case 'F2':
          if (mode === 'Filter') break
          setMode('Filter')
          setContentEdit('')
          setFormatEdit('')
          setContent('')
          setFormat('')
          contentRef.current.focus()
          break

        default:
          break
      }
    }
  }

  const handleKeyDown = (event) => {
    event.preventDefault()
    switch (event.key) {
      case 'Enter':
        if (isShowHelp) setShowHelp(false)
        else if (mode === 'Insert') {
          handleInsert()
        }
        setContent('')
        setFormat('')
        contentRef.current.focus()
        break

      case 'Escape':
        if (isShowHelp) setShowHelp(false)
        break

      case 'i':
      case 'F1':
        contentRef.current.focus()
        setMode('Insert')
        break

      case 'f':
      case 'F2':
        contentRef.current.focus()
        setMode('Filter')
        break

      case 'j':
      case 'ArrowDown':
        handleScroll()
        break

      case 'k':
      case 'ArrowUp':
        handleScroll(true)
        break

      case 'h':
        if (mode === 'Normal') setShowHelp((prev) => !prev)
        break

      case '~':
        if (mode === 'Normal')
          setHideCommands((prev) => {
            const newHideCommands = !prev
            saveData({ isHideCommands: newHideCommands, tasks })
            return newHideCommands
          })
        break

      default:
        break
    }
  }

  const handleScroll = (isScrollUp = false) => {
    if (isScrollUp) {
      setScrolling(true)
      setScrollUp(true)
    } else {
      setScrolling(true)
      setScrollUp(false)
    }
  }

  const quantity = useMemo(() => {
    let output = [
      { color: 'trivial', value: 0 },
      { color: 'urgent', value: 0 },
      { color: 'important', value: 0 },
      { color: 'vital', value: 0 }
    ]
    tasks.forEach((task) => {
      output[task.level].value += 1
    })
    return output
  }, [tasks])

  const displayQuantity = (value) => {
    if (value < 2) return `${value} task`
    return `${value} tasks`
  }

  const filteredTasks = useMemo(() => {
    if (mode === 'Normal' || mode === 'Insert') return tasks
    let newTasks = tasks
    newTasks = newTasks.filter((task) => isMatch(task.name, content))
    if (format.trim().length > 0) {
      if (isContain(format, ['o'], ['r'])) newTasks = newTasks.filter((task) => !task.isRecurring)
      else if (isContain(format, ['r'], ['o']))
        newTasks = newTasks.filter((task) => task.isRecurring)

      if (isContain(format, ['p'], ['c'])) newTasks = newTasks.filter((task) => !task.isCompleted)
      else if (isContain(format, ['c'], ['p']))
        newTasks = newTasks.filter((task) => task.isCompleted)

      const allLevels = getAllLevels(format)
      if (allLevels.length > 0) newTasks = newTasks.filter((task) => allLevels.includes(task.level))
    }
    return newTasks
  }, [tasks, content, format])

  const renderTasks = useMemo(() => {
    if (mode !== 'Edit') return filteredTasks
    let newTasks = filteredTasks
    if (contentEdit.trim().length > 0)
      newTasks = newTasks.map((task) => ({
        ...task,
        name: contentEdit.trim()
      }))
    if (formatEdit.trim().length > 0) {
      if (isContain(formatEdit, ['d'])) {
        newTasks = newTasks.map((task) => ({
          ...task,
          name: ''
        }))
      } else {
        if (isContain(formatEdit, ['o', 'r']))
          newTasks = newTasks.map((task) => ({
            ...task,
            isRecurring: getRecurring(formatEdit)
          }))
        if (isContain(formatEdit, ['p', 'c']))
          newTasks = newTasks.map((task) => ({
            ...task,
            isCompleted: getStatus(formatEdit)
          }))
        if (isContain(formatEdit, ['t', 'u', 'i', 'v']))
          newTasks = newTasks.map((task) => ({
            ...task,
            level: getLevel(formatEdit)
          }))
      }
    }
    setEditedTasks(newTasks)
    return newTasks
  }, [filteredTasks, contentEdit, formatEdit])

  useEffect(() => {
    if (renderTasks.length === 1) setContentEdit(renderTasks[0].name)
    else setContentEdit('')
  }, [renderTasks.length])

  const handleTags = (tagName) => {
    switch (tagName) {
      case 'f1':
      case 'f2':
        if (mode === 'Normal') return 'item bg-mode'
        return 'hidden'

      case 'd':
        if (mode === 'Edit') {
          if (isContain(formatEdit, ['d'])) return 'item bg-delete active'
          return 'item bg-delete'
        }
        return 'hidden'

      case 'o':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['o', 'r']) && !getRecurring(formatEdit))
              return 'item occasional active'
            return 'item occasional'

          case 'Filter':
            if (isContain(format, ['o'])) return 'item occasional active'
            return 'item occasional'

          case 'Insert':
            if (!getRecurring(format)) return 'item occasional active'
            return 'item occasional'

          default:
            return 'hidden'
        }

      case 'r':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['o', 'r']) && getRecurring(formatEdit))
              return 'item recurring active'
            return 'item recurring'

          case 'Filter':
            if (isContain(format, ['r'])) return 'item recurring active'
            return 'item recurring'

          case 'Insert':
            if (getRecurring(format)) return 'item recurring active'
            return 'item recurring'

          default:
            return 'hidden'
        }

      case 'p':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['p', 'c']) && !getStatus(formatEdit))
              return 'item pending active'
            return 'item pending'

          case 'Filter':
            if (isContain(format, ['p'])) return 'item pending active'
            return 'item pending'

          case 'Insert':
            if (!getStatus(format)) return 'item pending active'
            return 'item pending'

          default:
            return 'hidden'
        }

      case 'c':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['p', 'c']) && getStatus(formatEdit))
              return 'item completed active'
            return 'item completed'

          case 'Filter':
            if (isContain(format, ['c'])) return 'item completed active'
            return 'item completed'

          case 'Insert':
            if (getStatus(format)) return 'item completed active'
            return 'item completed'

          default:
            return 'hidden'
        }

      case 't':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['t', 'u', 'i', 'v']) && getLevel(formatEdit) === 0)
              return 'item trivial active'
            return 'item trivial'

          case 'Filter':
            if (isContain(format, ['t'])) return 'item trivial active'
            return 'item trivial'

          case 'Insert':
            if (getLevel(format) === 0) return 'item active trivial'
            return 'item trivial'

          default:
            return 'hidden'
        }

      case 'u':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['t', 'u', 'i', 'v']) && getLevel(formatEdit) === 1)
              return 'item urgent active'
            return 'item urgent'

          case 'Filter':
            if (isContain(format, ['u'])) return 'item urgent active'
            return 'item urgent'

          case 'Insert':
            if (getLevel(format) === 1) return 'item urgent active'
            return 'item urgent'

          default:
            return 'hidden'
        }

      case 'i':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['t', 'u', 'i', 'v']) && getLevel(formatEdit) === 2)
              return 'item important active'
            return 'item important'

          case 'Filter':
            if (isContain(format, ['i'])) return 'item important active'
            return 'item important'

          case 'Insert':
            if (getLevel(format) === 2) return 'item important active'
            return 'item important'

          default:
            return 'hidden'
        }

      case 'v':
        switch (mode) {
          case 'Edit':
            if (isContain(formatEdit, ['t', 'u', 'i', 'v']) && getLevel(formatEdit) === 3)
              return 'item vital active'
            return 'item vital'

          case 'Filter':
            if (isContain(format, ['v'])) return 'item vital active'
            return 'item vital'

          case 'Insert':
            if (getLevel(format) === 3) return 'item vital active'
            return 'item vital'

          default:
            return 'hidden'
        }

      default:
        break
    }
  }

  const getPercent = () => {
    const completedTasks = tasks.filter((task) => task.isCompleted)
    return `${Math.ceil((completedTasks.length * 100) / tasks.length)}% progress`
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onKeyUp={(event) => {
        if (['j', 'k', 'ArrowDown', 'ArrowUp'].includes(event.key)) setScrolling(false)
      }}
      onMouseDown={(event) => event.preventDefault()}
      tabIndex="0"
      className="focus:outline-none flex justify-center h-screen p-8"
    >
      <div className="relative flex flex-col items-center gap-8 w-full max-w-4xl">
        <h1 className="flex uppercase text-4xl tracking-widest font-black -skew-x-12">
          <span className="text-white px-4 py-2 bg-gray -translate-y-1 translate-x-1 shadow-[4px_4px_4px_#0003]">
            Yam
          </span>
          <span className="px-4 py-2 text-white bg-darkGray shadow-[inset_4px_4px_4px_#0003]">
            {tasks.length > 0 ? tasks.length : 'o'}nu<span className="tracking-normal">s</span>
          </span>
        </h1>
        {(mode === 'Filter' || mode === 'Edit') && (
          <div className="absolute left-0 top-16 item bg-mode text-xs px-2 py-1 text-white">
            {filteredTasks.length} {mode === 'Edit' ? 'selected' : 'matched'}
          </div>
        )}
        <div className="flex absolute right-0 top-16 text-xs">
          {tasks.length > 0 && <div className="item completed">{getPercent()}</div>}
          {quantity.map(({ color, value }) => {
            if (value > 0)
              return (
                <div key={color} className={`item ${color}`}>
                  {displayQuantity(value)}
                </div>
              )
          })}
        </div>
        <ul ref={containerTasksRef} className={`tasks${!isScrolling ? ' scroll-smooth' : ''}`}>
          {mode === 'Insert' && content.trim().length > 0 && (
            <li
              className={`task demo level-${getLevel(format)}${
                getRecurring(format) ? ' schedule' : ''
              }${getStatus(format) ? ' status' : ''}`}
            >
              <div className="text-ellipsis overflow-hidden">{content.trim()}</div>
            </li>
          )}
          {renderTasks.map((task) => (
            <li
              onClick={() => handleToggleState(task.id)}
              onContextMenu={() => handleDelete(task.id)}
              className={`task level-${task.level}${task.isRecurring ? ' schedule' : ''}${
                task.isCompleted ? ' status' : ''
              }${mode === 'Edit' && isContain(formatEdit, ['d']) ? ' deleted' : ''}`}
              key={task.id}
            >
              <div className="text-ellipsis overflow-hidden">{task.name}</div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col w-full">
          <div className="flex text-xs justify-between items-end">
            <div className="mode">{mode}</div>
            {!isHideCommands && (
              <div className="flex gap-2 flex-wrap-reverse justify-end">
                <div className={handleTags('f1')}>
                  <span>[I]</span>nsert
                </div>
                <div className={handleTags('f2')}>
                  <span>[F]</span>ilter
                </div>
                {(mode === 'Edit' ? !isContain(formatEdit, ['d']) : mode !== 'Normal') && (
                  <>
                    <div className="flex flex-wrap-reverse justify-end">
                      <div className={handleTags('o')}>
                        <span>[O]</span>ccasional
                      </div>
                      <div className={handleTags('r')}>
                        <span>[R]</span>ecurring
                      </div>
                    </div>
                    <div className="flex flex-wrap-reverse justify-end">
                      <div className={handleTags('p')}>
                        <span>[P]</span>ending
                      </div>
                      <div className={handleTags('c')}>
                        <span>[C]</span>ompleted
                      </div>
                    </div>
                    <div className="flex flex-wrap-reverse justify-end">
                      <div className={handleTags('t')}>
                        <span>[T]</span>rivial
                      </div>
                      <div className={handleTags('u')}>
                        <span>[U]</span>rgent
                      </div>
                      <div className={handleTags('i')}>
                        <span>[I]</span>mportant
                      </div>
                      <div className={handleTags('v')}>
                        <span>[V]</span>ital
                      </div>
                    </div>
                  </>
                )}
                <div className={handleTags('d')}>
                  <span>[D]</span>elete
                </div>
              </div>
            )}
          </div>
          <div className="relative flex overflow-hidden">
            <div className="flex flex-grow">
              <input
                ref={contentRef}
                className="input"
                type="text"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={handleContent}
                onMouseDown={(event) => {
                  event.stopPropagation()
                  if (mode === 'Normal') setMode('Insert')
                }}
                placeholder={mode === 'Normal' ? `[H]elp!` : 'Content...'}
              />
              {mode !== 'Normal' && (
                <input
                  ref={formatRef}
                  className="input format"
                  type="text"
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  onMouseDown={(event) => event.stopPropagation()}
                  onKeyDown={handleFormat}
                  placeholder="Format..."
                />
              )}
            </div>
            <div
              className={`absolute flex flex-grow inset-0 transform ${
                mode === 'Edit' ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <input
                ref={contentEditRef}
                className="input"
                type="text"
                value={contentEdit}
                onChange={(event) => setContentEdit(event.target.value)}
                onKeyDown={handleContentEdit}
                onMouseDown={(event) => event.stopPropagation()}
                placeholder="New content..."
              />
              <input
                ref={formatEditRef}
                className="input format"
                type="text"
                value={formatEdit}
                onChange={(event) => setFormatEdit(event.target.value)}
                onMouseDown={(event) => event.stopPropagation()}
                onKeyDown={handleFormatEdit}
                placeholder="New format..."
              />
            </div>
          </div>
        </div>
      </div>
      {isShowHelp && <Help helpRef={helpRef} />}
    </div>
  )
}

export default App

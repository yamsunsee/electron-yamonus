const Help = ({ helpRef }) => {
  return (
    <div className="w-full h-full bg-white z-50 fixed inset-0 flex items-center justify-center p-8 text-darkGray font-medium italic">
      <div
        ref={helpRef}
        className="border border-[#0003] h-full w-full max-w-4xl p-8 overflow-auto flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <span className="uppercase text-5xl font-black">Get started!</span>
          <span className="uppercase text-2xl font-black text-gray">
            with A "no-mouse" task management
          </span>
        </div>
        <div>
          <strong>Four modes:</strong>
          <p>
            <span className="tag bg-mode">Normal</span> <span className="tag bg-mode">Insert</span>{' '}
            <span className="tag bg-mode">Filter</span> and{' '}
            <span className="tag bg-mode">Edit</span> mode. To enter{' '}
            <span className="tag bg-mode">Edit</span> mode, you must first select tasks in{' '}
            <span className="tag bg-mode">Filter</span> mode.
          </p>
        </div>
        <div>
          <strong>Special keys:</strong>
          <p>
            <span className="tag bg-gray">Esc</span> to escape.
          </p>
          <p>
            <span className="tag bg-gray">Enter</span> to confirm and execute commands.
          </p>
          <p>
            <span className="tag bg-gray">Tab</span> to switch between content and formatting
            inputs.
          </p>
          <p>
            <span className="tag bg-gray">F1</span> <span className="tag bg-gray">F2</span>{' '}
            <span className="tag bg-gray">F3</span> to switch between{' '}
            <span className="tag bg-mode">Insert</span> <span className="tag bg-mode">Filter</span>{' '}
            and <span className="tag bg-mode">Edit</span> modes.
          </p>
          <p>
            <span className="tag bg-gray">↓</span> <span className="tag bg-gray">↑</span> to scroll
            through tasks. In <span className="tag bg-mode">Normal</span> mode, you can also use the{' '}
            <span className="tag bg-gray">j</span> <span className="tag bg-gray">k</span> keys.
          </p>
          <p>
            <span className="tag bg-gray">~</span> to toggle the visibility of recommended commands,
            which can only be used in <span className="tag bg-mode">Normal</span> mode.
          </p>
        </div>
        <div>
          <strong>Task priorities:</strong>
          <p>
            <span className="tag bg-trivial">Trivial</span> Tasks that are neither urgent nor
            important and can be eliminated entirely.
          </p>
          <p>
            <span className="tag bg-urgent">Urgent</span> Tasks that are not important but need to
            be completed quickly.
          </p>
          <p>
            <span className="tag bg-important">Important</span> Tasks that are important but not
            urgent and can be scheduled for later.
          </p>
          <p>
            <span className="tag bg-vital">Vital</span> Tasks that are both urgent and important and
            must be completed immediately.
          </p>
        </div>
        <div>
          <strong>Task status options:</strong>
          <p>
            <span className="tag bg-pending">Pending</span> Tasks that have not yet been completed
            or resolved.
          </p>
          <p>
            <span className="tag bg-completed">Completed</span> Tasks that have been finished and
            are no longer pending.
          </p>
        </div>
        <div>
          <strong>Task scheduling options:</strong>
          <p>
            <span className="tag bg-occasional">Occasional</span> Tasks that occur only once and are
            not repeated.
          </p>
          <p>
            <span className="tag bg-recurring">Recurring</span> Tasks that occur repeatedly or at
            regular intervals. The status will return to{' '}
            <span className="tag bg-pending">Pending</span> when the new day comes.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="uppercase text-2xl font-black text-gray">Tom's turn</span>
          <span className="uppercase text-5xl font-black">Give "Jerry" a break!</span>
        </div>
        <div className="text-xs text-gray w-full text-center">
          Made by @yamdev. Latest update: 10/03/2023. Current version: 2.1.0
        </div>
      </div>
    </div>
  )
}

export default Help

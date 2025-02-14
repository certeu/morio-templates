import modules from "./modules/index.mjs"

/*
 * A Morio stream processor to handle audit data
 *
 * This is designed to handle data in the 'audit' topic, which
 * typically holds data generated by Auditbeat agents,
 * although it can also process other data if it's well-formatted.
 *
 * This method will be called for ever incoming message on the audit topic
 *
 * @param {object} data - The data from RedPanda
 * @param {obectt} tools - The tools object
 * @param {string} topic - The topic the data came from
 */
export default function auditStreamProcessor (data, tools, topic) {
  /*
   * Create note when host ID is missing
   */
  if (!data.host.id) tools.note(`[audit] Host lacks ID: : ${JSON.stringify(data)}`)

  /*
   * Hand over to module-specific logic
   */
  const module = tools.get(data,['labels', 'morio.module'], false)
  if (module && typeof modules[module] === 'function') {
    /*
     * Hand of to module-specific code to determine what to do
     */
    const result = modules[module](data, tools)

    /*
     * Only update if we get data back from the module code
     */
    if (result) tools.cache.audit(result)
  }
  else if (tools.getSettings('tap.processors.audit.log_unhandled', false)) {
    tools.note(`[audit] Cannot process message`, data)
  }
  else tools.log.debug(`[audit] No module for: ${module}`)
}

/*
 * This is used for both the UI and to generate the default settings
 */
export const info = {
  info: `This stream processor will process audit data flowing through your Morio collection.

It can cache recent audit events, as well as enventify them for event-driven automation.
It also supports dynamic loading of module-specific logic.`,
  settings: {
    topics: ['audit'],
    cache: {
      dflt: true,
      title: 'Cache audit data',
      type: 'list',
      list: [
        {
          val: false,
          label: 'Do not cache audit data (disable)',
        },
        {
          val: true,
          label: 'Cache recent audit data',
          about: 'Caching audit data allows consulting it through the dashboards provided by Morio&apos;s UI service'
        },
      ],
    },
    eventify: {
      dflt: true,
      title: 'Eventify audit data',
      type: 'list',
      list: [
        {
          val: false,
          label: 'Do not eventify audit data (disable)',
        },
        {
          val: true,
          label: 'Auto-create events based on audit data',
          about: 'Eventifyingaudit data allows for event-driven automation and monitoring based on audit information',
        },
      ],
    },
    ttl: {
      dflt: 2,
      title: 'fixme',
      type: 'number'
    },
    log_unhandled: {
      dflt: false,
      title: 'Log unhandled audit data',
      type: 'list',
      list: [
        {
          val: false,
          label: 'Do not log unhandled audit data (disable)',
        },
        {
          val: true,
          label: 'Log unhandled audit data',
          about: 'This allows you to see the kind of audit data that is not being treated by this stream processor. It is intended as a debug tool for stream processor developers and will generate a lot of notes.'
        },
      ],
    },
  }
}

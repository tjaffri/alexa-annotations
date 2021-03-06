const annotation = (predicate, transform) => (skill, name) => {
  const route = skill.route || (() => false);

  skill.route = function(request, context) {
    const args = transform ? [transform(request), request, context] : [request, context];
    return route.call(this, request, context) || (predicate(request) && skill[name].apply(this, args));
  };

  return skill;
};

export const Launch = annotation(({ type }) => type === 'LaunchRequest');

export const SessionEnded = annotation(({ type }) => type === 'SessionEndedRequest');

export const Intent = (...names) => annotation(
  ({ type, intent = {} }) => type === 'IntentRequest' && names.indexOf(intent.name) >= 0,
  ({ intent = {} }) => (
    Object.values(intent.slots || {}).reduce((state, { name, value }) => (
      (name && value != null) ? { ...state, [name]: value } : state
    ), {})
  )
);

export const AudioPlayerEvent = (...names) => annotation(({ type = {} }) => names.indexOf(type) >= 0 );
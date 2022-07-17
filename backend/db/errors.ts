/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
export const enum DBError {
    ENTITY_NOT_FOUND = 'The entity being searched for wasn\'t found.',
    UNIQUE_ENTITY_ALREADY_EXISTS =
    'An entity with the same unique index already exists.',
    ALREADY_THREE_DRAFTS =
        'There are already three drafts in your account. Please either delete one or send one to the future.',
    UNKNOWN = 'There was an unknown error.'
}

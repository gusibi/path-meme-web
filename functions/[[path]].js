// functions/[[path]].js

export function onRequest(context) {
    return context.env.ASSETS.fetch(context.request);
}
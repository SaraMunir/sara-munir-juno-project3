import React from 'react'

function Wall() {
    return (
        <article className="wall">
            <div className="card">
                <input type="text" />
            </div>
            <div className="posts">
                <div className="card">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus dolorum quo alias optio, nam eos amet molestias voluptatem sed, sapiente ex quas voluptatibus autem rerum? A vitae assumenda laborum esse!</p>
                    <div className="likeStuf">
                        <button><i className="far fa-heart"></i></button>
                    </div>
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus dolorum quo alias optio, nam eos amet molestias voluptatem sed, sapiente ex quas voluptatibus autem rerum? A vitae assumenda laborum esse!</p>
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus dolorum quo alias optio, nam eos amet molestias voluptatem sed, sapiente ex quas voluptatibus autem rerum? A vitae assumenda laborum esse!</p>
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus dolorum quo alias optio, nam eos amet molestias voluptatem sed, sapiente ex quas voluptatibus autem rerum? A vitae assumenda laborum esse!</p>
                </div>
            </div>
        </article>
    )
}

export default Wall

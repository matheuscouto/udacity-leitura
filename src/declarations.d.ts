export interface Post {
    // Identificador único
    id: string,
    // Data de criação - dados default rastreiam isto em Unix time. 
    // Você pode usar Date.now() para obter este número
    timestamp: number,
    // Título do post
    title: string,
    // Corpo do post
    body: string,
    // Autor do post
    author: string,
    // Deve ser uma das categorias fornecidas pelo servidor
    category: string,
    // Votos líquidos que a postagem recebeu (default: 1)
    voteScore: number,
    // Marcado se o post foi 'deletado' (sem acesso no front end), (default: false)
		deleted: boolean,
		// Numero de comentários no post
		commentCount: number,
}

export interface Comment {
    // Identificador único
    id: string,
    // id do post pai
    parentId: string,
    // Data de criação - dados default rastreiam isto em Unix time. 
    // Você pode usar Date.now() para obter este número
    timestamp: number,
    // Corpo do comentário
    body: string,
    // Autor do comentário
    author: string,
    // Votos líquidos que a postagem recebeu (default: 1)
    voteScore: number,
    // Marcado se o post foi 'deletado' (sem acesso no front end), (default: false)
    deleted: boolean,
    // Marcado quando o post pai foi deletado, mas o comentário em si não foi.
    parentDeleted?: boolean,
}